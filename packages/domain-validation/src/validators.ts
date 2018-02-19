export const supportedValidators = {
  required: { createMsg: () => `Required` },
  match: { createMsg: ({ comparableField }) => `Should match field '${comparableField}'` },
  maxLength: { createMsg: ({ max }) => `Must be ${max} characters or less` },
  minLength: { createMsg: ({ min }) => `Must be ${min} characters or more` },
  numberCheck: { createMsg: () => `Must be a number` },
  minValue: { createMsg: ({ minVal }) => `Must be at least ${minVal}` },
  email: { createMsg: () => `Invalid email address` },
  alphaNumeric: { createMsg: () => `Only alphanumeric characters` },
  phoneNumber: { createMsg: () => `Invalid phone number, must be 10 digits` },
  equals: { createMsg: ({ comparableValue }) => `Should match '${comparableValue}'` }
};

let messages: any = {};

const setValidationMsg = msgs => {
  messages = msgs;
};

// Non empty validation
const required = (value, msg?) => (context, schemaValue) =>
  schemaValue && !value ? msg || pickMsg('required', { ...context, schemaValue }) : undefined;

// Match a particular field
const match = (value, msg?) => (context, comparableField) =>
  value !== context.values[comparableField] ? msg || pickMsg('match', { ...context, comparableField }) : undefined;

// Max length validation
const maxLength = (value, msg?) => (context, max) =>
  value && value.length > max ? msg || pickMsg('maxLength', { ...context, max }) : undefined;

// Min length validation
const minLength = (value, msg?) => (context, min) =>
  value && value.length < min ? msg || pickMsg('minLength', { ...context, min }) : undefined;

// Number validation
const numberCheck = (value, msg?) => context =>
  value && isNaN(Number(value)) ? msg || pickMsg('numberCheck', context) : undefined;

// Minimum value validation
const minValue = (value, msg?) => (context, minVal) =>
  value && value < minValue ? msg || pickMsg('minValue', { ...context, minVal }) : undefined;

// Email validation
const email = (value, msg?) => context =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? msg || pickMsg('email', context) : undefined;

// Alpha numeric validation
const alphaNumeric = (value, msg?) => context =>
  value && /[^a-zA-Z0-9 ]/i.test(value) ? msg || pickMsg('alphaNumeric', context) : undefined;

// Phone number validation
const phoneNumber = (value, msg?) => context =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value) ? msg || pickMsg('phoneNumber', context) : undefined;

// Equals validation
const equals = (value, msg?) => (context, comparableValue) =>
  value !== comparableValue ? msg || pickMsg('equals', { ...context, comparableValue }) : undefined;

/* HELPERS */

// Provides a message
const pickMsg = (validator, context) =>
  (typeof messages[validator] === 'function' ? messages[validator](context) : messages[validator]) ||
  supportedValidators[validator].createMsg(context);

export default {
  setValidationMsg,
  required,
  match,
  maxLength,
  minLength,
  numberCheck,
  minValue,
  email,
  alphaNumeric,
  phoneNumber,
  equals
};
