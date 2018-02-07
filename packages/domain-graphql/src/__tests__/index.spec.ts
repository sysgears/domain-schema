import DomainSchema, { Schema } from 'domain-schema';
import DomainGraphQL from '../index';

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

class InnerSchema extends Schema {
  public bool = Boolean;
}

class ExternalSchema extends Schema {
  public bool = Boolean;
}

class SampleSchema extends Schema {
  public __ = { foo: { bar: 'baz' } };
  public normField = { type: String, baz: 'foo' };
  public simpleField = DomainSchema.Int;
  public arrayField = [DomainSchema.Int];
  public schemaArrayField = [InnerSchema];
  public schemaNormArrayField = {
    type: [ExternalSchema],
    optional: true,
    external: true
  };
}

describe('DomainGraphQL', () => {
  it('should do something', () => {
    expect(new DomainGraphQL().generateTypes(Product).replace(/[\s]+/g, ' ')).toEqual(
      'type Category { id: Int! name: String! products: [Product!]! } type Product { id: Int! name: String! category: Category! }'
    );
    // console.log(new DomainGraphQL().generateTypes(SampleSchema));
    // console.log('deep:', new DomainGraphQL().generateTypes(SampleSchema, true));
    // console.log('Product:', ProductSchema);
  });
});
