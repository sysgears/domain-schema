import DomainSchema from 'domain-schema';

const supportedValidators = [
  'required',
  'match',
  'maxLength',
  'minLength',
  'numberCheck',
  'minValue',
  'email',
  'alphaNumeric',
  'phoneNumber',
  'equals'
];

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
              if (!supportedValidators.includes(validator)) {
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
    schemaValue && !value ? msg || Validators.getRequiredText() : undefined;

  // Match a particular field
  public static match = (value, msg, comparableField, values) =>
    value !== values[comparableField] ? msg || Validators.getMatchText(comparableField) : undefined;

  // Max length validation
  public static maxLength = (value, msg, max) =>
    value && value.length > max ? msg || Validators.getMaxLengthText(max) : undefined;

  // Min length validation
  public static minLength = (value, msg, min) =>
    value && value.length < min ? msg || Validators.getMinLengthText(min) : undefined;

  // Number validation
  public static numberCheck = (value, msg) =>
    value && isNaN(Number(value)) ? msg || Validators.getNumberCheckText() : undefined;

  // Minimum value validation
  public static minValue = (value, msg, minValue) =>
    value && value < minValue ? msg || Validators.getMinValueText(minValue) : undefined;

  // Email validation
  public static email = (value, msg) =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? msg || Validators.getEmailText() : undefined;

  // Alpha numeric validation
  public static alphaNumeric = (value, msg) =>
    value && /[^a-zA-Z0-9 ]/i.test(value) ? msg || Validators.getAlphaNumericText() : undefined;

  // Phone number validation
  public static phoneNumber = (value, msg) =>
    value && !/^(0|[1-9][0-9]{9})$/i.test(value) ? msg || Validators.getPhoneNumberText() : undefined;

  // Equals validation
  public static equals = (value, msg, comparableValue) =>
    value !== comparableValue ? msg || Validators.getEqualsText(comparableValue) : undefined;

  private static getRequiredText = () => {
    return Validators.messages.required || 'Required';
  };

  private static getMatchText = comparableField => {
    return Validators.messages.match || `Should match field '${comparableField}'`;
  };

  private static getMaxLengthText = max => {
    return Validators.messages.maxLength || `Must be ${max} characters or less`;
  };

  private static getMinLengthText = min => {
    return Validators.messages.minLength || `Must be ${min} characters or more`;
  };

  private static getNumberCheckText = () => {
    return Validators.messages.numberCheck || 'Must be a number';
  };

  private static getMinValueText = minValue => {
    return Validators.messages.minValue || `Must be at least ${minValue}`;
  };

  private static getEmailText = () => {
    return Validators.messages.email || 'Invalid email address';
  };

  private static getAlphaNumericText = () => {
    return Validators.messages.alphaNumeric || 'Only alphanumeric characters';
  };

  private static getPhoneNumberText = () => {
    return Validators.messages.phoneNumber || 'Invalid phone number, must be 10 digits';
  };

  private static getEqualsText = comparableValue => {
    return Validators.messages.equals || `Should match '${comparableValue}'`;
  };
}
