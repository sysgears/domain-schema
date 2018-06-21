export type Condition = Value | RichCondition;

export interface ExtSchemaContext extends SchemaContext {
  computedFieldName?: string;
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

export interface FieldValidator {
  value: Value;
  msg: string;
}

export type BooleanValidator = FieldValidator | boolean;
export type NumberValidator = FieldValidator | number;
export type StringValidator = FieldValidator | string;

export interface FieldValidators {
  required?: BooleanValidator;
  matches?: StringValidator;
  max?: NumberValidator;
  min?: NumberValidator;
  email?: BooleanValidator;
  alphaNumeric?: BooleanValidator;
  phoneNumber?: BooleanValidator;
  equals?: StringValidator;
}
