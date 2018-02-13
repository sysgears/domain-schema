import DomainSchema from 'domain-schema';

const supportedValidators = {
  required: { createMsg: () => `Required` },
  match: { createMsg: comparableField => `Should match field '${comparableField}'` },
  maxLength: { createMsg: max => `Must be ${max} characters or less` },
  minLength: { createMsg: min => `Must be ${min} characters or more` },
  numberCheck: { createMsg: () => `Must be a number` },
  minValue: { createMsg: minValue => `Must be at least ${minValue}` },
  email: { createMsg: () => `Invalid email address` },
  alphaNumeric: { createMsg: () => `Only alphanumeric characters` },
  phoneNumber: { createMsg: () => `Invalid phone number, must be 10 digits` },
  equals: { createMsg: comparableValue => `Should match '${comparableValue}'` }
};

export default class DomainReactForms {
  constructor(private schema: DomainSchema) {}

  public validate(formValues: any) {
    const errors = {};
    const validateForm = (values, schema, collector) => {
      Object.keys(schema)
        .filter(v => schema.hasOwnProperty(v))
        .forEach(v => {
          if (v === 'id') {
            return;
          }
          const s = schema[v];
          if (!s.type.isSchema) {
            Object.keys(s).forEach((validator: any) => {
              if (!supportedValidators[validator]) {
                return;
              }
              let msg = null;
              let validatorsValue = s[validator];
              if (validatorsValue.msg) {
                msg = validatorsValue.msg;
                validatorsValue = validatorsValue.value;
              }
              const result = Validators[validator](values[v], msg, validatorsValue, values);
              if (result) {
                collector[v] = result;
              }
            });
          } else {
            validateForm(values[v], schema[v].type.values, collector);
          }
        });
      return collector;
    };
    return validateForm(formValues, this.schema.values, errors);
  }

  public static setValidationMessages(messages) {
    Validators.setValidationMsg(messages);
  }
}

class Validators {
  private static messages: any = {};

  public static setValidationMsg = messages => {
    Validators.messages = messages;
  };

  // Non empty validation
  public static required = (value, msg, schemaValue) =>
    schemaValue && !value ? msg || Validators.pickMsg('required') : undefined;

  // Match a particular field
  public static match = (value, msg, comparableField, values) =>
    value !== values[comparableField] ? msg || Validators.pickMsg('match', comparableField) : undefined;

  // Max length validation
  public static maxLength = (value, msg, max) =>
    value && value.length > max ? msg || Validators.pickMsg('maxLength', max) : undefined;

  // Min length validation
  public static minLength = (value, msg, min) =>
    value && value.length < min ? msg || Validators.pickMsg('minLength', min) : undefined;

  // Number validation
  public static numberCheck = (value, msg) =>
    value && isNaN(Number(value)) ? msg || Validators.pickMsg('numberCheck') : undefined;

  // Minimum value validation
  public static minValue = (value, msg, minValue) =>
    value && value < minValue ? msg || Validators.pickMsg('minValue', minValue) : undefined;

  // Email validation
  public static email = (value, msg) =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? msg || Validators.pickMsg('email') : undefined;

  // Alpha numeric validation
  public static alphaNumeric = (value, msg) =>
    value && /[^a-zA-Z0-9 ]/i.test(value) ? msg || Validators.pickMsg('alphaNumeric') : undefined;

  // Phone number validation
  public static phoneNumber = (value, msg) =>
    value && !/^(0|[1-9][0-9]{9})$/i.test(value) ? msg || Validators.pickMsg('phoneNumber') : undefined;

  // Equals validation
  public static equals = (value, msg, comparableValue) =>
    value !== comparableValue ? msg || Validators.pickMsg('equals', comparableValue) : undefined;

  /* HELPERS */

  // Provides a message
  private static pickMsg = (validator, txtSnippet) => supportedValidators[validator].createMsg(txtSnippet);
}
