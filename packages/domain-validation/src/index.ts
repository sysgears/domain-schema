import DomainSchema from 'domain-schema';
import Validators, { supportedValidators } from './validators';

export default class DomainValidation {
  public static validate(initialValues: any, initialSchema: DomainSchema) {
    const errors = {};
    const validateSchema = (values, schema, collector) => {
      Object.keys(schema)
        .filter(field => schema.hasOwnProperty(field))
        .forEach(field => {
          if (field === 'id') {
            return;
          }
          const s = schema[field];
          if (!s.type.isSchema) {
            Object.keys(s).forEach((validator: any) => {
              let result;
              if (supportedValidators[validator]) {
                result = s[validator].msg
                  ? Validators[validator](values[field], s[validator].msg)(
                      { values, field, schema },
                      s[validator].value
                    )
                  : Validators[validator](values[field])({ values, field, schema }, s[validator]);
              } else if (validator === 'validators') {
                // handling custom validators
                s[validator].forEach(val => {
                  result = val(values[field], values) || result;
                });
              }
              if (result) {
                collector[field] = result;
              }
            });
          } else {
            validateSchema(values[field], schema[field].type.values, collector);
          }
        });
      return collector;
    };
    return validateSchema(initialValues, initialSchema.values, errors);
  }

  public static setValidationMessages(messages) {
    Validators.setValidationMsg(messages);
  }
}
