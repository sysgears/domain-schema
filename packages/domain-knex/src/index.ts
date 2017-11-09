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
}

export default DomainKnex;
