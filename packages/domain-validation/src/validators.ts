export const supportedValidators = {
  required: { createMsg: () => `Required` },
  match: { createMsg: ({ comparableField }) => `Should match field '${comparableField}'` },
  maxLength: { createMsg: ({ max }) => `Must be ${max} characters or less` },
  minLength: { createMsg: ({ min }) => `Must be ${min} characters or more` },
  numberCheck: { createMsg: () => `Must be a number` },
  minValue: { createMsg: ({ minValue }) => `Must be at least ${minValue}` },
  email: { createMsg: () => `Invalid email address` },
  alphaNumeric: { createMsg: () => `Only alphanumeric characters` },
  phoneNumber: { createMsg: () => `Invalid phone number, must be 10 digits` },
  equals: { createMsg: ({ comparableValue }) => `Should match '${comparableValue}'` }
};

export default class Validators {
  private static messages: any = {};

  public static setValidationMsg = messages => {
    Validators.messages = messages;
  };

  // Non empty validation
  public static required = (value, msg?) => (context, schemaValue) =>
    schemaValue && !value ? msg || Validators.pickMsg('required', { ...context, schemaValue }) : undefined;

  // Match a particular field
  public static match = (value, msg?) => (context, comparableField) =>
    value !== context.values[comparableField]
      ? msg || Validators.pickMsg('match', { ...context, comparableField })
      : undefined;

  // Max length validation
  public static maxLength = (value, msg?) => (context, max) =>
    value && value.length > max ? msg || Validators.pickMsg('maxLength', { ...context, max }) : undefined;

  // Min length validation
  public static minLength = (value, msg?) => (context, min) =>
    value && value.length < min ? msg || Validators.pickMsg('minLength', { ...context, min }) : undefined;

  // Number validation
  public static numberCheck = (value, msg?) => context =>
    value && isNaN(Number(value)) ? msg || Validators.pickMsg('numberCheck', context) : undefined;

  // Minimum value validation
  public static minValue = (value, msg?) => (context, minValue) =>
    value && value < minValue ? msg || Validators.pickMsg('minValue', { ...context, minValue }) : undefined;

  // Email validation
  public static email = (value, msg?) => context =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
      ? msg || Validators.pickMsg('email', context)
      : undefined;

  // Alpha numeric validation
  public static alphaNumeric = (value, msg?) => context =>
    value && /[^a-zA-Z0-9 ]/i.test(value) ? msg || Validators.pickMsg('alphaNumeric', context) : undefined;

  // Phone number validation
  public static phoneNumber = (value, msg?) => context =>
    value && !/^(0|[1-9][0-9]{9})$/i.test(value) ? msg || Validators.pickMsg('phoneNumber', context) : undefined;

  // Equals validation
  public static equals = (value, msg?) => (context, comparableValue) =>
    value !== comparableValue ? msg || Validators.pickMsg('equals', { ...context, comparableValue }) : undefined;

  /* HELPERS */

  // Provides a message
  private static pickMsg = (validator, context) =>
    (typeof Validators.messages[validator] === 'function'
      ? Validators.messages[validator](context)
      : Validators.messages[validator]) || supportedValidators[validator].createMsg(context);
}
