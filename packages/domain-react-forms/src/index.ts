import DomainSchema from 'domain-schema';

export default class DomainReactForms {
  constructor(private schema: DomainSchema) {}

  public validate(formValues: any) {
    const validateForm = (values, schema) => {
      const collector = {};
      Object.keys(schema)
        .filter(v => schema.hasOwnProperty(v))
        .forEach(v => {
          if (v === 'id') {
            return;
          }
          const s = schema[v];
          if (!Array.isArray(s.type)) {
            Object.keys(s).forEach((validator: any) => {
              if (validator === 'type') {
                return;
              }
              const result = Validators[validator](values[v], s[validator], values);
              if (result) {
                collector[v] = result;
              }
            });
          } else {
            const res = validateForm(values[v], schema[v].type[0].values);
            if (Object.keys(res).length > 0) {
              collector[v] = res;
            }
          }
        });

      return collector;
    };

    return validateForm(formValues, this.schema.values);
  }
}

class Validators {
  // Non empty validation
  public static optional = (value, schemaValue) => (schemaValue || value ? undefined : 'Required');

  // Match a particular field
  public static match = (value, comparableField, values) =>
    value !== values[comparableField] ? `Should match field '${comparableField}'` : undefined;

  // Max length validation
  public static maxLength = (value, max) =>
    value && value.length > max ? `Must be ${max} characters or less` : undefined;

  // Min length validation
  public static minLength = (value, min) =>
    value && value.length < min ? `Must be ${min} characters or more` : undefined;

  // Number validation
  public static numberCheck = value => (value && isNaN(Number(value)) ? 'Must be a number' : undefined);

  // Minimum value validation
  public static minValue = (value, minValue) =>
    value && value < minValue ? `Must be at least ${minValue}` : undefined;

  // Email validation
  public static email = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined;

  // Alpha numeric validation
  public static alphaNumeric = value =>
    value && /[^a-zA-Z0-9 ]/i.test(value) ? 'Only alphanumeric characters' : undefined;

  // Phone number validation
  public static phoneNumber = value =>
    value && !/^(0|[1-9][0-9]{9})$/i.test(value) ? 'Invalid phone number, must be 10 digits' : undefined;
}
