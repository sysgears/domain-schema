import { FieldValidators } from '@domain-schema/validation';
import { ComponentType } from 'react';

export interface SchemaField {
  type: any;
  fieldType?: string;
  input?: any;
  defaultValue?: string | boolean | number;
  component?: ComponentType<any>;
  matches?: string;
  validators?: [(value: any, values?: any) => string];
  required?: boolean | object;
  min?: number;
  max?: number;
}

export type FSF = SchemaField & FieldValidators; // Full Schema Field

export interface RenderComponentProps {
  input?: any;
  meta?: any;
  children?: any;
  options?: any;
  label?: string;
  placeholder?: string;
  value?: any;
  schema?: any;
  style?: object;
  setFieldValue?: any;
  setFieldTouched?: any;
  schemaName?: any;
}

export interface FormFieldType {
  name: string;
  component?: ComponentType<any>;
}

export interface ButtonsConfig {
  submit: any;
  reset?: any;
}
