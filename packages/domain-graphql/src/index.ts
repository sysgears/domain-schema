import Debug from 'debug';
import DomainSchema from 'domain-schema';

const debug = Debug('domain-graphql');

export default class {
  constructor() {}

  public generateTypes(schema) {
    const domainSchema = new DomainSchema(schema);

    return this._generateTypes(domainSchema, []);
  }

  public _generateField(field, value, results) {
    let result = '';
    switch (value.type.name) {
      case 'Boolean':
        result += 'Boolean';
        break;
      case 'ID':
        result += 'ID';
        break;
      case 'Integer':
        result += 'Int';
        break;
      case 'String':
        result += 'String';
        break;
      default:
        if (value.type.isSchema) {
          result += value.type.name;
          this._generateTypes(value.type, results);
        } else if (value.type.constructor === Array) {
          result += `[${this._generateField(field + '[]', { ...value, type: value.type[0] }, results)}]`;
        } else {
          throw new Error(`Don't know how to handle type ${value.type.name} of ${field}`);
        }
    }

    if (!value.optional) {
      result += '!';
    }

    return result;
  }

  private _generateTypes(schema, results) {
    let result = `type ${schema.name} {\n`;
    for (const key of schema.keys()) {
      const value = schema.values[key];
      if (!value.private) {
        result += `  ${key}: ` + this._generateField(schema.name + '.' + key, value, results) + '\n';
      }
    }

    result += '}';
    results.push(result);

    debug(results.join('\n'));

    return results.join('\n');
  }
}
