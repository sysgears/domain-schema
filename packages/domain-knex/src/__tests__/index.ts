import { Schema } from 'domain-schema';
import Knex, { CreateTableBuilder } from 'knex';

import DomainKnex from '../index';

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
});
