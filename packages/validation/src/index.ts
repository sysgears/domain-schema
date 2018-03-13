import DomainSchema from '@domain-schema/core';
import validators, { supportedValidators } from './validators';

type FieldInput = string | number | boolean;

interface RichCondition {
  msg: string;
  value: FieldInput;
}

type Condition = string | RichCondition;

interface SchemaContext {
  values: any;
  field: string;
  schema: any;
}

const checkWithValidator = (validatorName: string, value: FieldInput, context: SchemaContext, condition: Condition) =>
  typeof condition === 'string'
    ? validators[validatorName](value)(context, condition)
    : validators[validatorName](value, condition.msg)(context, condition.value);

export default class DomainValidator {
  public static validate(initialValues: any, initialSchema: DomainSchema) {
    const validateSchema = (values: any, schema: any, collector: any) => {
      Object.keys(schema)
        .filter(field => schema.hasOwnProperty(field))
        .forEach(field => {
          if (field === 'id') {
            return;
          }

          const schemaField = schema[field];
          if (!schemaField.type.isSchema) {
            Object.keys(schemaField).forEach((key: string) => {
              let result: any;
              if (supportedValidators[key]) {
                result = checkWithValidator(key, values[field], { values, field, schema }, schemaField[key]);
              } else if (key === 'validators') {
                // handling custom validators
                schemaField[key].forEach(validator => {
                  result = validator(values[field], values) || result;
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
    return validateSchema(initialValues, initialSchema.values, {});
  }

  public static setValidationMessages(messages) {
    validators.setValidationMsg(messages);
  }
}
