import DomainSchema, { Schema } from '@domain-schema/core';
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
   * @returns {any}
   */
  public validate(initialSchema: Schema, values: any = {}): any {
    const domainSchema = new DomainSchema(initialSchema);
    return this.validateSchema(domainSchema, values, []);
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
  public validateField(schema: DomainSchema, fieldName: any, schemaField: any, value: any, values: any): any {
    const error = { [fieldName]: [] };
    if (!schemaField.optional) {
      const result = this.checkWithValidator(
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
        const result = this.checkWithValidator(rule, value, { values, fieldName, schema }, '');
        if (result) {
          error[fieldName].push(result);
        }
      }
    }

    // validation for additional validators
    Object.keys(schemaField).forEach((key: string) => {
      if (supportedValidators[key] && key !== 'type') {
        const result = this.checkWithValidator(key, value, { values, fieldName, schema }, schemaField[key]);
        if (result) {
          error[fieldName].push(result);
        }
      } else if (key === 'validators') {
        // handling custom validators
        schemaField[key].forEach(validator => {
          const receivedError = validator(value);
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
  private validateSchema(schema: DomainSchema, values: any, seen: string[]): any {
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
  private checkWithValidator(validatorName: string, value: Value, context: SchemaContext, condition: Condition) {
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
}
