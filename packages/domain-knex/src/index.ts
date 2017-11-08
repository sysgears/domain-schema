import { decamelize } from 'humps';
import DomainSchema from 'domain-schema';
import Knex from 'knex';

const DEBUG = false;

export default class {
  private knex: Knex;

  constructor(knex) {
    this.knex = knex;
  }

  _addColumn(tableName, table, key, value) {
    let columnName = decamelize(key);
    let column;
    switch (value.type.name) {
      case 'Boolean':
        column = table.boolean(columnName);
        break;
      case 'Integer':
        column = table.integer(columnName);
        break;
      case 'String':
        column = table.string(columnName, value.max || undefined);
        break;
      default:
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

  async _createTables(parentTableName, schema): Promise<any> {
    const domainSchema = new DomainSchema(schema);
    const tableName = decamelize(domainSchema.name);
    return await this.knex.schema.createTable(tableName, table => {
      if (parentTableName) {
        table
          .integer(`${parentTableName}_id`)
          .unsigned()
          .references('id')
          .inTable(parentTableName)
          .onDelete('CASCADE');
        if (DEBUG) {
          console.log(`Foreign key ${tableName} -> ${parentTableName}.${parentTableName}_id`);
        }
      }

      table.increments('id');
      table.timestamps(false, true);

      const promises = [];

      for (let key of domainSchema.keys()) {
        const column = decamelize(key);
        const value = domainSchema.values[key];
        if (value.isSchema) {
          const hostTableName = domainSchema.__.transient ? parentTableName : tableName;
          const newPromise = this._createTables(hostTableName, value.type);
          promises.push(newPromise);
          if (DEBUG) {
            console.log(`Schema key: ${tableName}.${column} -> ${value.type.name}`);
          }
        } else if (!value.transient && key !== 'id') {
          this._addColumn(tableName, table, key, value);
          if (DEBUG) {
            console.log(`Scalar key: ${tableName}.${column} -> ${value.type.name}`);
          }
        }
      }

      return Promise.all(promises);
    });
  }

  _getTableNames(schema) {
    const domainSchema = new DomainSchema(schema);
    const tableName = decamelize(domainSchema.name);
    let tableNames = [];

    if (domainSchema.__.transient) {
      tableNames.push(tableName);
    }
    for (let key of domainSchema.keys()) {
      const value = domainSchema.values[key];
      if (value.isSchema) {
        tableNames = tableNames.concat(this._getTableNames(value.type));
      }
    }

    return tableNames;
  }

  createTables(schema) {
    const domainSchema = new DomainSchema(schema);
    if (domainSchema.__.transient) {
      throw new Error(`Unable to create tables for transient schema: ${domainSchema.name}`);
    }
    return this._createTables(null, domainSchema);
  }

  dropTables(domainSchema) {
    const tableNames = this._getTableNames(domainSchema);
    if (DEBUG) {
      console.log('Dropping tables:', tableNames);
    }
    return Promise.all(tableNames.map(name => this.knex.schema.dropTable(name)));
  }
}
