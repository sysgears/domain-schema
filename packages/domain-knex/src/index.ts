import Debug from 'debug';
import DomainSchema from 'domain-schema';
import { decamelize } from 'humps';
import Knex from 'knex';

const debug = Debug('domain-knex');

class DomainKnex {
  private knex: Knex;

  constructor(knex) {
    this.knex = knex;
  }

  public selectBy = (schema, fields) => {
    // form table name
    const tableName = decamelize(schema.name);

    // select fields
    const parentPath = [];
    const selectItems = [];
    const joinNames = [];
    this._getSelectFields(fields, parentPath, schema, selectItems, joinNames);

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

  public createTables(schema) {
    const domainSchema = new DomainSchema(schema);
    if (domainSchema.__.transient) {
      throw new Error(`Unable to create tables for transient schema: ${domainSchema.name}`);
    }
    return this._createTables(null, domainSchema);
  }

  public dropTables(domainSchema) {
    const tableNames = this._getTableNames(domainSchema);
    debug('Dropping tables:', tableNames);
    return Promise.all(tableNames.map(name => this.knex.schema.dropTable(name)));
  }

  private static _addColumn(tableName, table, key, value) {
    const columnName = decamelize(key);
    let column;
    if (value.type.name === 'Boolean') {
      column = table.boolean(columnName);
    } else if (value.type.name === 'Integer') {
      column = table.integer(columnName);
    } else if (value.type.name === 'Float') {
      column = table.float(columnName);
    } else if (value.type.name === 'String') {
      column = table.string(columnName, value.max || undefined);
    } else {
      throw new Error(`Don't know how to handle type ${value.type.name} of ${tableName}.${columnName}`);
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

  private async _createTables(parentTableName, schema): Promise<any> {
    const domainSchema = new DomainSchema(schema);
    const tableName = decamelize(domainSchema.name);
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
        if (value.type.isSchema) {
          const hostTableName = domainSchema.__.transient ? parentTableName : tableName;
          const newPromise = this._createTables(hostTableName, value.type);
          promises.push(newPromise);
          debug(`Schema key: ${tableName}.${column} -> ${value.type.name}`);
        } else if (!value.transient && key !== 'id') {
          DomainKnex._addColumn(tableName, table, key, value);
          debug(`Scalar key: ${tableName}.${column} -> ${value.type.name}`);
        }
      }

      return Promise.all(promises);
    });
  }

  private _getTableNames(schema) {
    const domainSchema = new DomainSchema(schema);
    const tableName = decamelize(domainSchema.name);
    let tableNames = [];

    if (domainSchema.__.transient) {
      tableNames.push(tableName);
    }
    for (const key of domainSchema.keys()) {
      const value = domainSchema.values[key];
      if (value.type.isSchema) {
        tableNames = tableNames.concat(this._getTableNames(value.type));
      }
    }

    return tableNames;
  }

  private _getSelectFields(fields, parentPath, domainSchema, selectItems, joinNames) {
    for (const key of Object.keys(fields)) {
      if (key !== '__typename') {
        const value = domainSchema.values[key];
        if (fields[key] === true) {
          if (!value.transient) {
            const as = parentPath.length > 0 ? `${parentPath.join('_')}_${key}` : key;
            selectItems.push(`${decamelize(domainSchema.name)}.${decamelize(key)} as ${as}`);
          }
        } else {
          if (!value.type.__.transient) {
            joinNames.push(decamelize(value.type.name));
          }

          parentPath.push(key);

          this._getSelectFields(fields[key], parentPath, value.type, selectItems, joinNames);

          parentPath.pop();
        }
      }
    }
  }
}

export default DomainKnex;
