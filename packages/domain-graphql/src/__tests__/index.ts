import DomainSchema, { Schema } from 'domain-schema';
import DomainGraphQL from '../index';

const CategorySchema = new DomainSchema(
  class Category extends Schema {
    public id = DomainSchema.Integer;
    public name = {
      type: String,
      searchText: true
    };
  }
);

const ProductSchema = new DomainSchema(
  class Product extends Schema {
    public id = DomainSchema.Integer;
    public name = {
      type: String,
      searchText: true
    };
    public category = CategorySchema;
  }
);

class InnerSchema extends Schema {
  public bool = Boolean;
}

class ExternalSchema extends Schema {
  public bool = Boolean;
}

class SampleSchema extends Schema {
  public __ = { foo: { bar: 'baz' } };
  public normField = { type: String, baz: 'foo' };
  public simpleField = DomainSchema.Integer;
  public arrayField = [DomainSchema.Integer];
  public schemaArrayField = [InnerSchema];
  public schemaNormArrayField = {
    type: [ExternalSchema],
    optional: true,
    external: true
  };
}

describe('DomainGraphQL', () => {
  it('should do something', () => {
    // console.log(new DomainGraphQL().generateTypes(SampleSchema));
    // console.log('deep:', new DomainGraphQL().generateTypes(SampleSchema, true));
    // console.log('Product:', ProductSchema);
  });
});
