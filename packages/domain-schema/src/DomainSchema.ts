export interface SchemaClass {
  new (): Schema;
}

export class Schema {
  __?: any;
}

class DomainSchema extends Schema {
  private _schemaClass: SchemaClass;
  private _schema: Schema;
  private _values: any;

  static Integer = class Integer {};
  static ID = class ID {};

  static _throwWrongSchema(SchemaClass) {
    throw new Error(`Schema ${SchemaClass ? SchemaClass.name : SchemaClass} must be an instance of Schema`);
  }

  constructor(clazz: SchemaClass) {
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
      this._values = this._buildValues();
      if (!(this._schema instanceof Schema)) {
        DomainSchema._throwWrongSchema(clazz);
      }
    }
  }

  _buildValues(): any {
    const values = {};
    for (let key of Object.keys(this._schema)) {
      if (key === '__') {
        continue;
      }
      const value = this._schema[key];
      if (typeof value !== 'function' && !value.type) {
        throw new Error(`'type' key is required for schema field ${this._schemaClass.name}.${key}`);
      }
      const def = typeof value === 'function' ? { type: value } : { ...value };
      def.isSchema = DomainSchema.isSchema(def.type);
      def.type = def.isSchema ? new DomainSchema(def.type) : def.type;

      values[key] = def;
    }

    return values;
  }

  get __() {
    return this._schema.__ || {};
  }

  get values() {
    return this._values;
  }

  keys() {
    return Object.keys(this._values);
  }

  get name() {
    return this._schemaClass.name;
  }

  get schema() {
    return this._schema;
  }

  static isSchema(SchemaClass) {
    if (SchemaClass instanceof DomainSchema) {
      return true;
    } else if (!DomainSchema._isConstructable(SchemaClass)) {
      return false;
    } else {
      const schema = new SchemaClass();
      return schema instanceof Schema;
    }
  }

  static _isConstructable(f) {
    try {
      Reflect.construct(String, [], f);
    } catch (e) {
      return false;
    }
    return true;
  }
}

export default DomainSchema;
