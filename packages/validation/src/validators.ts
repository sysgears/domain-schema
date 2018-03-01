export const supportedValidators = {
  required: { createMsg: () => `Required` },
  match: { createMsg: ({ comparableField }) => `Should match field '${comparableField}'` },
  max: {
    createMsg: ({ maxVal, isString }) =>
      isString ? `Must be ${maxVal} characters or less` : `Must be at most ${maxVal}`
  },
  min: {
    createMsg: ({ minVal, isString }) =>
      isString ? `Must be ${minVal} characters or more` : `Must be at least ${minVal}`
  },
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

// Min value/length validation
const min = (value, msg?) => (context, minVal) =>
  context.schema[context.field].type === String
    ? value && value.length < minVal ? msg || pickMsg('min', { ...context, minVal, isString: true }) : undefined
    : value && value < minVal ? msg || pickMsg('min', { ...context, minVal, isString: false }) : undefined;

// Max value/length validation
const max = (value, msg?) => (context, maxVal) =>
  context.schema[context.field].type === String
    ? value && value.length > maxVal ? msg || pickMsg('max', { ...context, maxVal, isString: true }) : undefined
    : value && value > maxVal ? msg || pickMsg('max', { ...context, maxVal, isString: false }) : undefined;

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
  min,
  max,
  email,
  alphaNumeric,
  phoneNumber,
  equals
};
