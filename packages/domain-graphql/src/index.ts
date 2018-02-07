import Debug from 'debug';
import DomainSchema, { Schema } from 'domain-schema';

const debug = Debug('domain-graphql');

export default class {
  constructor() {}

  public generateTypes(schema: Schema, options: any = {}): string {
    const domainSchema = new DomainSchema(schema);
    options.deep = options.deep || true;

    return this._generateTypes(domainSchema, options, [], []);
  }

  public _generateField(field: string, value: any, options: any, results: string[], seen: string[]): string {
    let result = '';
    const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;
    if (hasTypeOf(Boolean)) {
      result += 'Boolean';
    } else if (hasTypeOf(DomainSchema.ID)) {
      result += 'ID';
    } else if (hasTypeOf(DomainSchema.Int)) {
      result += 'Int';
    } else if (hasTypeOf(DomainSchema.Float)) {
      result += 'Float';
    } else if (hasTypeOf(String)) {
      result += 'String';
    } else if (hasTypeOf(Date)) {
      result += 'Date';
    } else if (hasTypeOf(DomainSchema.DateTime)) {
      result += 'DateTime';
    } else if (hasTypeOf(DomainSchema.Time)) {
      result += 'Time';
    } else {
      if (value.type.isSchema) {
        result += value.type.name;
        if (options.deep && !value.external) {
          this._generateTypes(value.type, options, results, seen);
        }
      } else if (value.type.constructor === Array) {
        result += `[${this._generateField(field + '[]', { ...value, type: value.type[0] }, options, results, seen)}]`;
      } else {
        throw new Error(`Don't know how to handle type ${value.type.name} of ${field}`);
      }
    }

    if (!value.optional) {
      result += '!';
    }

    return result;
  }

  private _generateTypes(schema: DomainSchema, options: any, results: string[], seen: string[]): string {
    if (seen.indexOf(schema.name) >= 0 || schema.__.exclude) {
      return;
    }
    seen.push(schema.name);
    let result = `type ${schema.name} {\n`;
    for (const key of schema.keys()) {
      const value = schema.values[key];
      if (!value.private) {
        result += `  ${key}: ` + this._generateField(schema.name + '.' + key, value, options, results, seen) + '\n';
      }
    }

    result += '}';
    results.push(result);

    debug(results.join('\n'));

    return results.join('\n\n');
  }
}
