/* tslint:disable:max-classes-per-file */
export interface SchemaClass {
  new (): Schema;
}

export class Schema {
  public __?: any;
}

class DomainSchema extends Schema {
  public static Integer = class Integer {};
  public static ID = class ID {};

  private _schemaClass: SchemaClass;
  private _schema: Schema;
  private _values: any;

  public constructor(clazz: SchemaClass) {
    super();
    if (clazz instanceof DomainSchema) {
      this._schemaClass = clazz._schemaClass;
      this._schema = clazz._schema;
      this._values = clazz._values;
    } else if (!DomainSchema._isConstructable(clazz)) {
      DomainSchema._throwWrongSchema(clazz);
    } else {
      this._schemaClass = clazz;
      this._schema = new clazz();
      this._values = this._normalizeValues();
      if (!(this._schema instanceof Schema)) {
        DomainSchema._throwWrongSchema(clazz);
      }
    }
  }

  public get isSchema() {
    return true;
  }

  public get __() {
    return this._schema.__ || {};
  }

  public get values() {
    return this._values;
  }

  public keys() {
    return Object.keys(this._values);
  }

  public get name() {
    return this._schemaClass.name;
  }

  public get schema() {
    return this._schema;
  }

  private static _throwWrongSchema(clazz: any) {
    throw new Error(`Schema ${clazz ? clazz.name : clazz} must be an instance of Schema`);
  }

  private _normalizeValues(): any {
    const values = {};
    for (const key of Object.keys(this._schema)) {
      if (key === '__') {
        continue;
      }
      const value = this._schema[key];
      if (typeof value !== 'function' && value.constructor !== Array && !value.type) {
        throw new Error(`'type' key is required for schema field ${this._schemaClass.name}.${key}`);
      } else if (value.constructor === Array && value.length !== 1) {
        throw new Error(`Array key ${this._schemaClass.name}.${key} should contain one type inside`);
      }
      const def = typeof value === 'function' || value.constructor === Array ? { type: value } : { ...value };

      def.type = DomainSchema._isSchema(def.type) ? new DomainSchema(def.type) : def.type;

      values[key] = def;
    }

    return values;
  }

  private static _isSchema(clazz: any) {
    if (clazz instanceof DomainSchema) {
      return true;
    } else if (!DomainSchema._isConstructable(clazz)) {
      return false;
    } else {
      const schema = new clazz();
      return schema instanceof Schema;
    }
  }

  private static _isConstructable(f) {
    try {
      Reflect.construct(String, [], f);
    } catch (e) {
      return false;
    }
    return true;
  }
}

export default DomainSchema;
