export class Schema {
  public __?: any;
}

class DomainSchema extends Schema {
  public static ID = class ID extends String {};
  public static Int = class Int extends Number {};
  public static Float = class Float extends Number {};
  public static Time = class Time extends Date {};
  public static DateTime = class DateTime extends Date {};

  private _schemaClass: any;
  private _schema: Schema;
  private _values: any;

  public constructor(clazz: any, _defs?: any) {
    super();
    if (clazz instanceof DomainSchema) {
      this._schemaClass = clazz._schemaClass;
      this._schema = clazz._schema;
      this._values = clazz._values;
    } else {
      this._schemaClass = clazz;
      this._schema = new clazz();
      this._values = this._normalizeValues({ ..._defs, [clazz]: this });
      if (!(this._schema instanceof Schema)) {
        DomainSchema._throwWrongSchema(clazz);
      }
    }
  }

  public get isSchema(): boolean {
    return true;
  }

  public get __(): any {
    return this._schema.__ || {};
  }

  public get values(): any {
    return this._values;
  }

  public keys(): string[] {
    return Object.keys(this._values);
  }

  public get name(): string {
    return this.__.name;
  }

  public get schema(): Schema {
    return this._schema;
  }

  private static _throwWrongSchema(clazz: any) {
    throw new Error(`Schema class ${clazz ? clazz.name : clazz} must be an instance of Schema`);
  }

  private _normalizeValues(_defs: any): any {
    const values = {};
    if (!('__' in this._schema) || !this.__.name) {
      throw new Error(`Schema class ${this._schemaClass.name} must define __.name`);
    }
    for (const key of Object.keys(this._schema)) {
      if (key === '__') {
        continue;
      }
      const value = this._schema[key];
      if (typeof value !== 'function' && value.constructor !== Array && !value.type && !value.isSchema) {
        throw new Error(`'type' key is required for schema field ${this.__.name}.${key}`);
      } else if (value.constructor === Array && value.length !== 1) {
        throw new Error(`Array key ${this.__.name}.${key} should contain one type inside`);
      }
      const def =
        typeof value === 'function' || value instanceof Schema || value.constructor === Array
          ? { type: value }
          : { ...value };

      const type = def.type.constructor === Array ? def.type[0] : def.type;
      const targetType = DomainSchema._isSchema(type)
        ? _defs.hasOwnProperty(type)
          ? _defs[type]
          : new DomainSchema(type, _defs)
        : type;

      if (def.type.constructor === Array) {
        def.type[0] = targetType;
      } else {
        def.type = targetType;
      }

      values[key] = def;
    }

    return values;
  }

  private static _isSchema(clazz: any): boolean {
    if (clazz instanceof DomainSchema) {
      return true;
    } else {
      const schema = new clazz();
      return schema instanceof Schema;
    }
  }
}

export default DomainSchema;
