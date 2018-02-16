import DomainSchema, { Schema } from '../index';

class Product extends Schema {
  public __ = { name: 'Product' };
  public id = DomainSchema.Int;
  public name = String;
  public category = Category;
}

class Category extends Schema {
  public __ = { name: 'Category' };
  public id = DomainSchema.Int;
  public name = String;
  public products = [Product];
}

class InnerSchema extends Schema {
  public __ = { name: 'InnerSchema' };
  public bool = Boolean;
}

class SampleSchema extends Schema {
  public __ = { name: 'SampleSchema', foo: { bar: 'baz' } };
  public normField = { type: String, baz: 'foo' };
  public simpleField = Number;
  public arrayField = [Number];
  public schemaArrayField = [InnerSchema];
  public schemaNormArrayField = {
    type: [InnerSchema],
    optional: true
  };
  public schemaField = InnerSchema;
  public domainSchemaField = new DomainSchema(InnerSchema);
}

describe('DomainSchema', () => {
  it('should instantiate from Schema class', () => {
    expect(
      new DomainSchema(
        class extends Schema {
          public __ = { name: 'Schema' };
        }
      )
    ).toBeDefined();
  });

  it('should instantiate from DomainSchema class', () => {
    const schema = class extends Schema {
      public __ = { name: 'Schema' };
    };
    const domainSchema = new DomainSchema(new DomainSchema(schema));
    expect(domainSchema.schema).toEqual(new schema());
  });

  it('__.name should match the name of the class', () => {
    class MySchema extends Schema {
      public __ = { name: 'MySchema' };
    }
    expect(new DomainSchema(MySchema).__.name).toEqual(new MySchema().__.name);
  });

  it('should expose __ schema properties', () => {
    expect(new DomainSchema(SampleSchema).__).toEqual(new SampleSchema().__);
  });

  it('should not expose __ in schema values', () => {
    expect(new DomainSchema(SampleSchema).values.__).toBeUndefined();
  });

  it('should keep normalized key', () => {
    expect(new DomainSchema(SampleSchema).values.normField).toEqual({ baz: 'foo', type: String });
  });

  it('should normalize simple key', () => {
    expect(new DomainSchema(SampleSchema).values.simpleField).toEqual({ type: Number });
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

  it('domain schema value should have type.isSchema = true', () => {
    expect(new DomainSchema(SampleSchema).values.domainSchemaField.type.isSchema).toBeTruthy();
  });

  it('should reject values without type', () => {
    expect(
      () =>
        new DomainSchema(
          class extends Schema {
            public __ = { name: 'Schema' };
            public field = { foo: 'bar' };
          }
        )
    ).toThrow();
  });

  it('should reject schema without __.name', () => {
    expect(() => new DomainSchema(class extends Schema {})).toThrow();
  });

  it('should reject empty array values', () => {
    expect(
      () =>
        new DomainSchema(
          class extends Schema {
            public __ = { name: 'Schema' };
            public field = [];
          }
        )
    ).toThrow();
  });

  it('should reject array with multiple values', () => {
    expect(
      () =>
        new DomainSchema(
          class extends Schema {
            public __ = { name: 'Schema' };
            public field = [String, Number];
          }
        )
    ).toThrow();
  });

  it('schema should normalize array-type value', () => {
    expect(new DomainSchema(SampleSchema).values.arrayField).toEqual({ type: [Number] });
  });

  it('schema value in Array should have type.isSchema = true', () => {
    expect(new DomainSchema(SampleSchema).values.schemaArrayField.type[0].isSchema).toBeTruthy();
  });

  it('normalized schema value in Array should have type.isSchema = true', () => {
    expect(new DomainSchema(SampleSchema).values.schemaNormArrayField.type[0].isSchema).toBeTruthy();
  });

  it('should handle cyclic schema defs', () => {
    const productSchema = new DomainSchema(Product);
    expect(productSchema.values.category.type.values.products.type[0]).toEqual(productSchema);
  });
});
