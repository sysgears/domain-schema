import DomainSchema, { Schema } from '@domain-schema/core';
import Debug from 'debug';
import { decamelize } from 'humps';
import Knex, { TableBuilder } from 'knex';

const debug = Debug('@domain-schema/knex');

class DomainKnex {
  private knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  public selectBy = (schema: Schema, fields: string[]) => {
    const domainSchema = new DomainSchema(schema);
    // form table name
    const tableName = decamelize(domainSchema.__.name);

    // select fields
    const parentPath = [];
    const selectItems = [];
    const joinNames = [];
    this._getSelectFields(fields, parentPath, domainSchema, selectItems, joinNames, []);

    debug('Select items:', selectItems);
    debug('Join on tables:', joinNames);

    return query => {
      // join table names
      joinNames.map(joinName => {
        query.leftJoin(joinName, `${joinName}.${tableName}_id`, `${tableName}.id`);
      });

      return query.select(selectItems);
    };
  };

  public createTables(schema: Schema): Promise<any> {
    const domainSchema = new DomainSchema(schema);
    if (domainSchema.__.transient) {
      throw new Error(`Unable to create tables for transient schema: ${domainSchema.__.name}`);
    }
    return this._createTables(null, domainSchema, []);
  }

  public dropTables(schema: Schema): Promise<any> {
    const domainSchema = new DomainSchema(schema);
    const tableNames = this._getTableNames(domainSchema, []);
    debug('Dropping tables:', tableNames);
    return Promise.all(tableNames.map(name => this.knex.schema.dropTable(name)));
  }

  private static _addColumn(tableName: string, table: TableBuilder, key: string, value: any) {
    const columnName = decamelize(key);
    let column;
    const type = value.type.constructor === Array ? value.type[0] : value.type;

    const hasTypeOf = targetType => type === targetType || type.prototype instanceof targetType;

    if (hasTypeOf(Boolean)) {
      column = table.boolean(columnName);
    } else if (hasTypeOf(DomainSchema.Int)) {
      column = table.integer(columnName);
    } else if (hasTypeOf(DomainSchema.Float)) {
      column = table.float(columnName);
    } else if (hasTypeOf(String)) {
      column = table.string(columnName, value.max || undefined);
    } else if (hasTypeOf(Date)) {
      column = table.dateTime(columnName);
    } else {
      throw new Error(`Don't know how to handle type ${type.__.name} of ${tableName}.${columnName}`);
    }
    if (value.unique) {
      column.unique();
    }
    if (!value.optional) {
      column.notNullable();
    }
    if (value.default !== undefined) {
      column.defaultTo(value.default);
    }
  }

  private async _createTables(parentTableName: string, schema: DomainSchema, seen: string[]): Promise<any> {
    if (seen.indexOf(schema.__.name) >= 0) {
      return Promise.resolve(null);
    }
    seen.push(schema.__.name);
    const domainSchema = new DomainSchema(schema);
    const tableName = decamelize(domainSchema.__.name);
    return this.knex.schema.createTable(tableName, table => {
      if (parentTableName) {
        table
          .integer(`${parentTableName}_id`)
          .unsigned()
          .references('id')
          .inTable(parentTableName)
          .onDelete('CASCADE');
        debug(`Foreign key ${tableName} -> ${parentTableName}.${parentTableName}_id`);
      }

      table.increments('id');
      table.timestamps(false, true);

      const promises = [];

      for (const key of domainSchema.keys()) {
        const column = decamelize(key);
        const value = domainSchema.values[key];
        const isOneToMany = value.type.constructor === Array;
        const type = value.type.constructor === Array ? value.type[0] : value.type;

        if (type.isSchema) {
          const hostTableName = domainSchema.__.transient ? parentTableName : tableName;
          const newPromise = this._createTables(isOneToMany ? hostTableName : null, type, seen);
          const foreignTable = decamelize(type.__.name);

          promises.push(newPromise);
          debug(`Schema key: ${tableName}.${column} -> ${type.__.name}`);

          if (!isOneToMany && parentTableName !== foreignTable) {
            table
              .integer(`${column}_id`)
              .unsigned()
              .references('id')
              .inTable(foreignTable)
              .onDelete('CASCADE');
            debug(`Foreign key ${tableName} -> ${column}.${column}_id`);
          }
        } else if (!value.transient && key !== 'id') {
          DomainKnex._addColumn(tableName, table, key, value);
          debug(`Scalar key: ${tableName}.${column} -> ${domainSchema.__.name}`);
        }
      }

      return Promise.all(promises);
    });
  }

  private _getTableNames(domainSchema: DomainSchema, seen: string[]): string[] {
    if (seen.indexOf(domainSchema.__.name) >= 0) {
      return [];
    }
    seen.push(domainSchema.__.name);
    const tableName = decamelize(domainSchema.__.name);
    let tableNames = [];

    if (!domainSchema.__.transient) {
      tableNames.push(tableName);
    }
    for (const key of domainSchema.keys()) {
      const value = domainSchema.values[key];
      const type = value.type.constructor === Array ? value.type[0] : value.type;
      if (type.isSchema) {
        tableNames = tableNames.concat(this._getTableNames(type, seen));
      }
    }

    return tableNames;
  }

  private _getSelectFields(
    fields: string[],
    parentPath: string[],
    domainSchema: DomainSchema,
    selectItems: string[],
    joinNames: string[],
    seen: string[]
  ) {
    if (seen.indexOf(domainSchema.__.name) >= 0) {
      return;
    }
    seen.push(domainSchema.__.name);
    for (const key of Object.keys(fields)) {
      if (key !== '__typename') {
        const value = domainSchema.values[key];
        if (fields[key] === true) {
          if (!value.transient) {
            const as = parentPath.length > 0 ? `${parentPath.join('_')}_${key}` : key;
            selectItems.push(`${decamelize(domainSchema.__.name)}.${decamelize(key)} as ${as}`);
          }
        } else {
          const type = value.type.constructor === Array ? value.type[0] : value.type;
          if (!type.__.transient) {
            joinNames.push(decamelize(type.__.name));
          }

          parentPath.push(key);

          this._getSelectFields(fields[key], parentPath, type, selectItems, joinNames, seen);

          parentPath.pop();
        }
      }
    }
  }
}

export default DomainKnex;
