import DomainSchema, { Schema } from '../index';

class InnerSchema extends Schema {
  bool = Boolean
}

class SampleSchema extends Schema {
  __ = { foo: { bar: 'baz' } };
  normField = { type: String, baz: 'foo' };
  simpleField = Number;
  arrayField = [Number];
  schemaField = InnerSchema;
}

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

  it('should expose __ schema properties', () => {
    expect(new DomainSchema(SampleSchema).__).toEqual(new SampleSchema().__);
  });

  it('should not expose __ in schema values', () => {
    expect(new DomainSchema(SampleSchema).values.__).toBeUndefined();
  });

  it('should keep normalized key', () => {
    expect(new DomainSchema(SampleSchema).values.normField).toEqual({baz: 'foo', type: String});
  });

  it('should normalize simple key', () => {
    expect(new DomainSchema(SampleSchema).values.simpleField).toEqual({type: Number});
  });

  it('should return key in keys', () => {
    expect(new DomainSchema(SampleSchema).keys()).toContain('schemaField');
  });

  it('should not return __ in keys', () => {
    expect(new DomainSchema(SampleSchema).keys()).not.toContain('__');
  });

  it('non-schema value should not have type.isSchema = true', () => {
    expect(new DomainSchema(SampleSchema).values.normField.type.isSchema).toBeUndefined();
  });

  it('schema value should have type.isSchema = true', () => {
    expect(new DomainSchema(SampleSchema).values.schemaField.type.isSchema).toBeTruthy();
  });

  it('should reject values without type', () => {
    expect(() => new DomainSchema(class extends Schema { field = {foo: 'bar'} })).toThrow();
  });

  it('should reject empty array values', () => {
    expect(() => new DomainSchema(class extends Schema { field = [] })).toThrow();
  });

  it('should reject array with multiple values', () => {
    expect(() => new DomainSchema(class extends Schema { field = [String, Number] })).toThrow();
  });

  it('schema should normalize array-type value', () => {
    expect(new DomainSchema(SampleSchema).values.arrayField).toEqual({type: [Number]});
  })
});
