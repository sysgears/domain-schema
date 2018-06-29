import { ExtSchemaContext, SchemaContext, Value } from './types';

export const supportedValidators = {
  required: { createMsg: () => `Required` },
  matches: { createMsg: ({ comparableField }: ExtSchemaContext) => `Should match field '${comparableField}'` },
  max: {
    createMsg: ({ maxVal, isString }: ExtSchemaContext) =>
      isString ? `Must be ${maxVal} characters or less` : `Must be at most ${maxVal}`
  },
  min: {
    createMsg: ({ minVal, isString }: ExtSchemaContext) =>
      isString ? `Must be ${minVal} characters or more` : `Must be at least ${minVal}`
  },
  email: { createMsg: () => `Invalid email address` },
  alphaNumeric: { createMsg: () => `Only alphanumeric characters` },
  phoneNumber: { createMsg: () => `Invalid phone number, must be 10 digits` },
  equals: { createMsg: ({ comparableValue }: ExtSchemaContext) => `Should match '${comparableValue}'` },
  numeric: { createMsg: () => `Must be number` },
  bool: { createMsg: () => `Must be boolean` }
};

let messages: any = {};

const setValidationMsg = (msgs: any) => {
  messages = msgs;
};

// Non empty validation
const required = (value: Value, msg?: string) => (context: SchemaContext, schemaValue: boolean): string | undefined =>
  schemaValue && !value ? msg || pickMsg('required', { ...context, schemaValue }) : undefined;

// Match a particular field
const matches = (value: Value, msg?: string) => (context: SchemaContext, comparableField: string): string | undefined =>
  value !== context.values[comparableField] ? msg || pickMsg('matches', { ...context, comparableField }) : undefined;

// Min value/length validation
const min = (value: Value, msg?: string) => (context: SchemaContext, minVal: number): string | undefined =>
  context.schema.values[context.fieldName].type === String
    ? value && (value as string).length < minVal
      ? msg || pickMsg('min', { ...context, minVal, isString: true })
      : undefined
    : value && value < minVal ? msg || pickMsg('min', { ...context, minVal, isString: false }) : undefined;

// Max value/length validation
const max = (value: Value, msg?: string) => (context: SchemaContext, maxVal: number): string | undefined =>
  context.schema.values[context.fieldName].type === String
    ? value && (value as string).length > maxVal
      ? msg || pickMsg('max', { ...context, maxVal, isString: true })
      : undefined
    : value && value > maxVal ? msg || pickMsg('max', { ...context, maxVal, isString: false }) : undefined;

// Email validation
const email = (value: string, msg?: string) => (context: SchemaContext): string | undefined =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? msg || pickMsg('email', context) : undefined;

// Alpha numeric validation
const alphaNumeric = (value: string, msg?: string) => (context: SchemaContext): string | undefined =>
  value && /[^a-zA-Z0-9 ]/i.test(value) ? msg || pickMsg('alphaNumeric', context) : undefined;

// Phone number validation
const phoneNumber = (value: string, msg?: string) => (context: SchemaContext): string | undefined =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value) ? msg || pickMsg('phoneNumber', context) : undefined;

// Equals validation
const equals = (value: Value, msg?: string) => (context: SchemaContext, comparableValue: Value): string | undefined =>
  value !== comparableValue ? msg || pickMsg('equals', { ...context, comparableValue }) : undefined;

// Number validator
const numeric = (value: Value, msg?: string) => (context: SchemaContext): string | undefined =>
  value && Number.isNaN(Number(value)) ? msg || pickMsg('numeric', context) : undefined;

// Boolean validator
const bool = (value: Value, msg?: string) => (context: SchemaContext): string | undefined =>
  value && typeof value !== 'boolean' ? msg || pickMsg('bool', context) : undefined;

/* HELPERS */

// Provides a message
const pickMsg = (validator: string, context: ExtSchemaContext): string =>
  (typeof messages[validator] === 'function' ? messages[validator](context) : messages[validator]) ||
  supportedValidators[validator].createMsg(context);

export default {
  setValidationMsg,
  required,
  matches,
  min,
  max,
  email,
  alphaNumeric,
  phoneNumber,
  equals,
  numeric,
  bool
};
