export type Condition = Value | RichCondition;

export interface ExtSchemaContext extends SchemaContext {
  comparableField?: string;
  comparableValue?: Value;
  isString?: boolean;
  maxVal?: number;
  minVal?: number;
  schemaValue?: Value;
}

export interface RichCondition {
  msg: string;
  value: Value;
}

export interface SchemaContext {
  fieldName: string;
  schema: any;
  values: any;
}

export type Value = string | number | boolean;
