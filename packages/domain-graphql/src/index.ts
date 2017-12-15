import Debug from 'debug';
import DomainSchema from 'domain-schema';

const debug = Debug('domain-graphql');

export default class {
  constructor() {}

  public generateTypes(schema, deep = false) {
    const domainSchema = new DomainSchema(schema);

    return this._generateTypes(domainSchema, deep, [], []);
  }

  public _generateField(field, value, deep, results, seen) {
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
          if (deep) {
            this._generateTypes(value.type, deep, results, seen);
          }
        } else if (value.type.constructor === Array) {
          result += `[${this._generateField(field + '[]', { ...value, type: value.type[0] }, deep, results, seen)}]`;
        } else {
          throw new Error(`Don't know how to handle type ${value.type.name} of ${field}`);
        }
    }

    if (!value.optional) {
      result += '!';
    }

    return result;
  }

  private _generateTypes(schema, deep, results, seen) {
    if (seen.indexOf(schema.name) >= 0) {
      return;
    }
    seen.push(schema.name);
    let result = `type ${schema.name} {\n`;
    for (const key of schema.keys()) {
      const value = schema.values[key];
      if (!value.private) {
        result += `  ${key}: ` + this._generateField(schema.name + '.' + key, value, deep, results, seen) + '\n';
      }
    }

    result += '}';
    results.push(result);

    debug(results.join('\n'));

    return results.join('\n');
  }
}
