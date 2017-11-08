import DomainSchema, { Schema } from '../index';

describe('DomainSchema', () => {
  it('should instantiate from Schema class', () => {
    new DomainSchema(class extends Schema {});
  });

  it('should instantiate from DomainSchema class', () => {
    const schema = class extends Schema {};
    const domainSchema = new DomainSchema(new DomainSchema(schema));
    expect(domainSchema.schema).toEqual(new schema());
  });

  it('.name should match the name of the class', () => {
    class MySchema extends Schema {}
    expect(new DomainSchema(MySchema).name).toEqual(MySchema.name);
  });
});
