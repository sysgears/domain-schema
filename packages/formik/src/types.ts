import { FieldValidators } from '@domain-schema/validation';
import { ComponentType } from 'react';

export interface SchemaField {
  type: any;
  fieldType: string;
  input?: any;
  defaultValue?: string | boolean | number;
  fieldAttrs?: any;
  component?: ComponentType<any>;
}

export type FSF = SchemaField & FieldValidators; // Full Schema Field
