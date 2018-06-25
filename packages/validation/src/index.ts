import DomainSchema from '@domain-schema/core';
import { camelize } from 'humps';
import { Condition, SchemaContext, Value } from './types';
import validators, { supportedValidators } from './validators';

const checkWithValidator = (validatorName: string, value: Value, context: SchemaContext, condition: Condition) =>
  typeof condition !== 'object'
    ? validators[validatorName](value)(context, condition)
    : validators[validatorName](value, condition.msg)(context, condition.value);

export default class DomainValidator {
  public static validate(initialValues: any, initialSchema: DomainSchema) {
    const validateSchema = (values: any, schema: any, collector: any, schemaTypeName = '') => {
      Object.keys(schema)
        .filter(field => schema.hasOwnProperty(field))
        .forEach((fieldName: string) => {
          if (fieldName === 'id') {
            return;
          }
          const schemaField = schema[fieldName];
          if (!schemaField.type.isSchema) {
            // if optional is not specified then call required validator (by default all fields are required)
            if (!schemaField.optional) {
              const result = checkWithValidator(
                'required',
                values[fieldName],
                { values, fieldName, schema },
                schemaField.required || true
              );
              if (result) {
                addSchemaError(collector, fieldName, schemaTypeName, result);
                return;
              }
            }
            Object.keys(schemaField).forEach((key: string) => {
              let result: any;
              if (supportedValidators[key]) {
                result = checkWithValidator(key, values[fieldName], { values, fieldName, schema }, schemaField[key]);
              } else if (key === 'validators') {
                // handling custom validators
                schemaField[key].forEach(validator => {
                  result = validator(values[fieldName], values) || result;
                });
              }
              if (result) {
                addSchemaError(collector, fieldName, schemaTypeName, result);
              }
            });
          } else if (!schemaField.blackbox) {
            validateSchema(values[fieldName], schema[fieldName].type.values, collector, schema[fieldName].type.name);
          }
        });
      return collector;
    };

    const addSchemaError = (collector, fieldName, schemaTypeName, result) => {
      if (schemaTypeName) {
        const schemaTypeNameCamelized = camelize(schemaTypeName);
        if (collector[schemaTypeNameCamelized]) {
          collector[schemaTypeNameCamelized][fieldName] = result;
          return;
        }
        const field = {};
        field[fieldName] = result;
        collector[schemaTypeNameCamelized] = field;
        return;
      }
      collector[fieldName] = result;
      return;
    };

    return validateSchema(initialValues, initialSchema.values, {});
  }

  public static setValidationMessages(messages: any) {
    validators.setValidationMsg(messages);
  }
}
