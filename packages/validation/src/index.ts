import DomainSchema, { Schema } from '@domain-schema/core';
import startCase from 'lodash.startcase';
import { Condition, SchemaContext, Value } from './types';
import validators, { supportedValidators } from './validators';

export default class DomainValidator {
  /**
   *
   * @type {([BooleanConstructor , string] | [NumberConstructor , string] | [StringConstructor , string] |
   * [DateConstructor , string])[]}
   */
  public static readonly TYPE_VALIDATORS: ReadonlyArray<[object, string]> = [
    [Boolean, 'bool'],
    [Number, 'numeric'],
    [String, 'string'],
    [Date, 'date']
  ];

  constructor() {}

  /**
   *
   * @param {} initialSchema
   * @param values
   * @param {string} type
   * @returns {any}
   */
  public static validate(initialSchema: Schema, values: any = {}, type: string = ''): any {
    const domainSchema = new DomainSchema(initialSchema);
    const validationErrors = DomainValidator.validateSchema(domainSchema, values, []);
    return type === 'form' ? DomainValidator.domainValidationErrorsAdapter(validationErrors) : validationErrors;
  }

  /**
   *
   * @param {} schema
   * @param fieldName
   * @param schemaField
   * @param value
   * @param values
   * @returns {any}
   */
  public static validateField(schema: DomainSchema, fieldName: any, schemaField: any, value: any, values: any): any {
    const error = { [fieldName]: [] };
    if (!schemaField.optional) {
      const result = DomainValidator.checkWithValidator(
        'required',
        value,
        { values, fieldName, schema },
        schemaField.required || true
      );
      if (result) {
        error[fieldName].push(result);
      }
    }
    const hasTypeOf = targetType => schemaField.type === targetType || schemaField.type.prototype instanceof targetType;

    // validation for schema type
    for (const validator of DomainValidator.TYPE_VALIDATORS) {
      const [type, rule] = validator;
      if (hasTypeOf(type) && supportedValidators[rule]) {
        const result = DomainValidator.checkWithValidator(rule, value, { values, fieldName, schema }, '');
        if (result) {
          error[fieldName].push(result);
        }
      }
    }

    // validation for additional validators
    Object.keys(schemaField).forEach((key: string) => {
      if (supportedValidators[key] && key !== 'type') {
        const result = DomainValidator.checkWithValidator(key, value, { values, fieldName, schema }, schemaField[key]);
        if (result) {
          error[fieldName].push(result);
        }
      } else if (key === 'validators') {
        // handling custom validators
        schemaField[key].forEach(validator => {
          const receivedError = validator(value, values);
          if (receivedError) {
            error[fieldName].push(receivedError);
          }
        });
      }
    });

    if (error[fieldName] && Array.isArray(error[fieldName])) {
      if (error[fieldName].length === 0) {
        return {};
      } else if (error[fieldName].length === 1) {
        return { [fieldName]: error[fieldName][0] };
      }
    }

    return error;
  }

  /**
   *
   * @param {} schema
   * @param values
   * @param {string[]} seen
   * @returns {any}
   */
  private static validateSchema(schema: DomainSchema, values: any, seen: string[]): any {
    const errors = {};
    seen.push(schema.__.name);
    for (const key of schema.keys()) {
      const schemaField = schema.values[key];
      const value = values ? (values[key] ? values[key] : null) : null;
      let nestedSchema = null;
      if (schemaField.type.isSchema) {
        nestedSchema = schemaField.type;
      } else if (schemaField.type.constructor === Array) {
        nestedSchema = schemaField.type[0];
      }
      if (nestedSchema) {
        if (seen.indexOf(nestedSchema.__.name) >= 0 || schemaField.blackbox) {
          continue;
        }
        const nestedSchemaErrors = this.validateSchema(nestedSchema, value, seen);
        if (Object.keys(nestedSchemaErrors).length === 0 && nestedSchemaErrors.constructor === Object) {
          continue;
        }
        Object.assign(errors, { [key]: nestedSchemaErrors });
      } else {
        Object.assign(errors, this.validateField(schema, key, schemaField, value, values));
      }
    }

    return errors;
  }

  /**
   *
   * @param {string} validatorName
   * @param {Value} value
   * @param {SchemaContext} context
   * @param {Condition} condition
   * @returns {any}
   */
  private static checkWithValidator(validatorName: string, value: Value, context: SchemaContext, condition: Condition) {
    return typeof condition !== 'object'
      ? validators[validatorName](value)(context, condition)
      : validators[validatorName](value, condition.msg)(context, condition.value);
  }

  /**
   * @param messages
   */
  public static setValidationMessages(messages: any) {
    validators.setValidationMsg(messages);
  }

  /**
   *
   * @param rawErrors
   * @returns {{}}
   */
  public static domainValidationErrorsAdapter(rawErrors: object): object {
    const computedErrors = {};
    for (const errorField in rawErrors) {
      if (rawErrors.hasOwnProperty(errorField) && rawErrors[errorField] === Object(rawErrors[errorField])) {
        computedErrors[errorField] = 'Required ';
        const nestedErrors = [];
        nestedErrors.push(startCase(errorField));
        for (const nestedErrorField in rawErrors[errorField]) {
          if (
            rawErrors[errorField].hasOwnProperty(nestedErrorField) &&
            rawErrors[errorField][nestedErrorField] === Object(rawErrors[errorField][nestedErrorField])
          ) {
            nestedErrors.push(startCase(nestedErrorField));
          }
        }
        computedErrors[errorField] += nestedErrors.join(', ');
      } else {
        if (errorField === 'id') {
          continue;
        }
        computedErrors[errorField] =
          Array.isArray(rawErrors[errorField]) && rawErrors[errorField].length > 0
            ? rawErrors[errorField][0]
            : (computedErrors[errorField] = rawErrors[errorField]);
      }
    }
    return computedErrors;
  }
}
