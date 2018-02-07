import DomainSchema, { Schema } from 'domain-schema';
import Knex, { ColumnBuilder, CreateTableBuilder, ReferencingColumnBuilder } from 'knex';

import DomainKnex from '../index';

class Product extends Schema {
  public id = DomainSchema.Int;
  public name = String;
  public category = Category;
}

class Category extends Schema {
  public id = DomainSchema.Int;
  public name = String;
  public products = [Product];
}

describe('DomainKnex', () => {
  it('should create table from empty schema with id and timestamps', () => {
    const TableMock = jest.fn<CreateTableBuilder>(() => ({
      increments() {
        return this;
      },
      timestamps() {
        return this;
      }
    }));
    const table = new TableMock();
    const knexSchema = {
      createTable(name, callback) {
        callback(table);
      }
    };
    const KnexMock = jest.fn<Knex>(() => ({
      schema: knexSchema
    }));
    const createTableSpy = jest.spyOn(knexSchema, 'createTable');
    const incrementsSpy = jest.spyOn(table, 'increments');
    const timestampsSpy = jest.spyOn(table, 'timestamps');
    class MySchema extends Schema {}
    expect(new DomainKnex(new KnexMock()).createTables(MySchema)).toBeDefined();
    expect(createTableSpy).toHaveBeenCalledWith('my_schema', expect.any(Function));
    expect(incrementsSpy).toHaveBeenCalledWith('id');
    expect(timestampsSpy).toHaveBeenCalledWith(false, true);
  });

  it('should create tables from mututally dependent types', () => {
    const RefColumnMock = jest.fn<ReferencingColumnBuilder>(() => ({
      inTable() {
        return columnMock;
      }
    }));
    const refColumnMock = new RefColumnMock();
    const ColumnMock = jest.fn<ColumnBuilder>(() => ({
      notNullable() {
        return this;
      },
      unsigned() {
        return this;
      },
      references() {
        return refColumnMock;
      },
      onDelete() {
        return this;
      }
    }));
    const columnMock = new ColumnMock();
    const TableMock = jest.fn<CreateTableBuilder>(() => ({
      increments() {
        return this;
      },
      timestamps() {
        return this;
      },
      string() {
        return columnMock;
      },
      integer() {
        return columnMock;
      },
      boolean() {
        return columnMock;
      }
    }));
    const table = new TableMock();
    const knexSchema = {
      createTable(name, callback) {
        callback(table);
      }
    };
    const KnexMock = jest.fn<Knex>(() => ({
      schema: knexSchema
    }));
    expect(new DomainKnex(new KnexMock()).createTables(Product)).toBeDefined();
  });
});
