import DomainSchema, { Schema } from 'domain-schema';
import DomainGraphQL from '../index';

class InnerSchema extends Schema {
  public bool = Boolean;
}

class SampleSchema extends Schema {
  public __ = { foo: { bar: 'baz' } };
  public normField = { type: String, baz: 'foo' };
  public simpleField = DomainSchema.Integer;
  public arrayField = [DomainSchema.Integer];
  public schemaArrayField = [InnerSchema];
}

describe('DomainGraphQL', () => {
  it('should do something', () => {
    // console.log(new DomainGraphQL().generateTypes(SampleSchema));
  });
});
