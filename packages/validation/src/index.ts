import DomainSchema, { Schema } from '@domain-schema/core';
import { camelize } from 'humps';
import { Condition, SchemaContext, Value } from './types';
import validators, { supportedValidators } from './validators';

export default class DomainValidator {
  public static readonly VALIDATION_RULES = new Map([
    [Boolean, 'booleans'],
    [DomainSchema.ID, 'id'],
    [DomainSchema.Int, 'numbers'],
    [DomainSchema.Float, 'numbers'],
    [String, 'string'],
    [Date, 'date'],
    [DomainSchema.DateTime, 'date'],
    [DomainSchema.Time, 'date']
  ]);

  constructor() {}

  public validate(initialSchema: Schema, initialValues: any = {}): any {
    const domainSchema = new DomainSchema(initialSchema);
    return this.validateSchema(domainSchema, initialValues, {}, []);
  }

  private validateField(
    schema: DomainSchema,
    fieldName: any,
    schemaField: any,
    value: any,
    values,
    errors: any,
    seen: string[]
  ): any {
    if (!schemaField.optional && !schemaField.type.isSchema && schemaField.type.constructor !== Array) {
      const result = this._checkWithValidator(
        'required',
        value,
        { values, fieldName, schema },
        schemaField.required || true
      );
      if (result) {
        errors[fieldName] = result;
      }
    }
    const hasTypeOf = targetType => schemaField.type === targetType || schemaField.type.prototype instanceof targetType;

    // validation for schema type
    for (const [type, rule] of DomainValidator.VALIDATION_RULES) {
      if (hasTypeOf(type) && supportedValidators[rule]) {
        const result = this._checkWithValidator(rule, value, { values, fieldName, schema }, '');
        if (result) {
          errors[fieldName] = result;
        }
      }
    }

    // validation for additional attributes or custom validators
    Object.keys(schemaField).forEach((key: string) => {
      if (supportedValidators[key] && key !== 'type') {
        const result = this._checkWithValidator(key, value, { values, fieldName, schema }, schemaField[key]);
        if (result) {
          errors[fieldName] = result;
        }
      } else if (key === 'validators') {
        // handling custom validators
        schemaField[key].forEach(validator => {
          errors[fieldName] = validator(value, value);
        });
      }
    });

    if (schemaField.type.isSchema) {
      if (!schemaField.blackbox) {
        if (seen.indexOf(schemaField.type.__.name) >= 0) {
          return errors;
        }
        const camelizedSchemaName = camelize(schemaField.type.__.name);
        errors[camelizedSchemaName] = {};
        this.validateSchema(schemaField.type, value, errors[camelizedSchemaName], seen);
      }
    } else if (schemaField.type.constructor === Array) {
      if (seen.indexOf(schemaField.type[0].__.name) >= 0) {
        return errors;
      }
      const camelizedSchemaName = camelize(schemaField.type[0].__.name);
      errors[camelizedSchemaName] = {};
      this.validateSchema(schemaField.type[0], value, errors[camelizedSchemaName], seen);
    }
    if (Object.keys(errors).length === 0 && errors.constructor === Object) {
      errors = {};
    }
    return errors;
  }

  private validateSchema(schema: DomainSchema, values: any, errors: any, seen: string[]): any {
    if (seen.indexOf(schema.__.name) >= 0 || schema.__.exclude) {
      return;
    }
    seen.push(schema.__.name);
    for (const key of schema.keys()) {
      const schemaField = schema.values[key];
      errors = this.validateField(schema, key, schemaField, values[key], values, errors, seen);
    }

    return errors;
  }
  private _checkWithValidator(validatorName: string, value: Value, context: SchemaContext, condition: Condition) {
    return typeof condition !== 'object'
      ? validators[validatorName](value)(context, condition)
      : validators[validatorName](value, condition.msg)(context, condition.value);
  }
}
