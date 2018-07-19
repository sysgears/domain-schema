import DomainSchema, { Schema } from '@domain-schema/core';
import DomainValidator, { FieldValidators } from '@domain-schema/validation';
import { FormikProps, withFormik } from 'formik';
import * as React from 'react';
import { ComponentType, CSSProperties, ReactElement } from 'react';

import Field from './FieldAdapter';
import { ButtonsConfig, FormFieldType, FSF } from './types';
import { pascalize, camelize } from 'humps';

export default class DomainSchemaFormik {
  private static fields: any = {
    custom: {
      name: 'custom'
    }
  };
  private static defaultFormFieldTypes = {
    schemaFieldType: 'select',
    commonFieldType: 'input',
    complexSchemaFieldType: 'nested'
  };
  private static formComponents: any = {};
  private fields: any = {};
  private formComponents: any = {};
  private configFormik = {
    enableReinitialize: true,
    mapPropsToValues: (props) => this.getValuesFromSchema(this.schema, props.values),
    handleSubmit : (values, { props: { onSubmit }, ...formikBag }) => {
      onSubmit(values, formikBag);
    },
    validate: (values: any) => this.validate(values)
  };
  public requiredMessage = 'Required ';

  /**
   * @param {} schema
   */
  constructor(private schema: Schema) {
    this.schema = new DomainSchema(schema);
  }

  /**
   * Set default field types for the form
   * @param {string} schemaFieldType
   * @param {string} commonFieldType
   * @param {string} complexSchemaFieldType
   */
  public static setDefaultFormFieldTypes (schemaFieldType: string,
                                          commonFieldType: string,
                                          complexSchemaFieldType : string = 'nested'): void{
    DomainSchemaFormik.defaultFormFieldTypes  = {
      schemaFieldType,
      commonFieldType,
      complexSchemaFieldType
    }
  }

  /**
   * Get default field types for the form
   * @returns {object}
   */
  public static getDefaultFormFieldTypes () {
    return DomainSchemaFormik.defaultFormFieldTypes;
  }

  /**
   * Validate form fields
   * @param formValues
   * @returns {object}
   */
  public validate(formValues: any): object {
    return DomainSchemaFormik.transformErrors(DomainValidator.validate(this.schema, formValues) , this.requiredMessage);
  }

  /**
   * @param {any} values
   * @returns {any}
   */
  public generateFields({ values }: FormikProps<any>) {
    const formElements = this.generateFieldComponents(values, this.schema);
    return <React.Fragment>{formElements}</React.Fragment>;
  }

  /**
   * Generate form with fields
   * @param {ButtonsConfig | any} buttonsConfig
   * @param formAttrs
   * @returns {React.ComponentType<any>}
   */
  public generateForm(buttonsConfig?: ButtonsConfig | any, formAttrs?: any) {
    return withFormik(this.configFormik)(({ values, isValid, handleReset, handleSubmit }: FormikProps<any>) => {
      const formElements = this.generateFieldComponents(values, this.schema);
      formElements.push(this.genButtons(buttonsConfig || {}, isValid, handleReset));
      const Form = (this.formComponents.form && this.formComponents.form.component) ||
        (DomainSchemaFormik.formComponents.form && DomainSchemaFormik.formComponents.form.component);
      return (
        <Form onSubmit={handleSubmit} name={this.schema.name} input={formAttrs}>
          {formElements}
        </Form>
      );
    });
  }

  /**
   * Set component to specific form fieldType, for instance scope
   * @param components
   */
  public setFormComponents(components: any): void {
    Object.keys(components).forEach(fieldType => {
      if (fieldType === 'form' || fieldType === 'button') {
        this.formComponents[fieldType] = DomainSchemaFormik.getFieldType(fieldType, components);
      } else {
        this.fields[fieldType] = DomainSchemaFormik.getFieldType(fieldType, components);
      }
    });
    this.fields.custom = {
      name: 'custom'
    };
  }

  /**
   * Set component to specific form fieldType, for global scope
   * @param components
   */
  public static setFormComponents(components: any): void {
    Object.keys(components).forEach(fieldType => {
      if (fieldType === 'form' || fieldType === 'button') {
        DomainSchemaFormik.formComponents[fieldType] = DomainSchemaFormik.getFieldType(fieldType, components);
      } else {
        DomainSchemaFormik.fields[fieldType] = DomainSchemaFormik.getFieldType(fieldType, components);
      }
    });
  }

  /**
   * Map initial values according to schema fields
   * @param {} schema
   * @param values
   * @returns {object}
   */
  public getValuesFromSchema(schema: Schema, values: any ): object {
    let fields = {};
    for (const key of schema.keys()){
      const value = schema.values[key];
      if (value.show !== false && value.type.constructor !== Array) {
        fields[key] = values ? values[key] : '';
      } else if (value.type.constructor === Array) {
        fields[key] = values ? values[key] : [];
      }
    }
    return fields;
  }

  /**
   * Bound form field type with received component
   * @param {string} fieldType
   * @param components
   * @returns {object}
   */
  private static getFieldType = (fieldType: string, components: any) : object => ({
    name: fieldType,
    component: components[fieldType]
  });

  /**
   * Creates form fields with corresponding components
   * @param values
   * @param {} schema
   * @param {boolean} nested
   * @returns {any[]}
   */
  private generateFieldComponents(values: any, schema: DomainSchema, nested: boolean = false) {
    const formFields = [];
    for (const fieldName of schema.keys()){
      if (fieldName === 'id' || schema.values[fieldName].ignore) {
        continue;
      }
      const schemaField: FSF = schema.values[fieldName];
      const isSchema = (type) => type instanceof DomainSchema;
      // if hasMany relation exists or nested schema in nested schema - skip field creation
      if (Array.isArray(schemaField.type) || (isSchema(schemaField.type) && nested)){
        continue;
      }
      const oneToOne = isSchema(schemaField.type) &&
        schemaField.type.values[camelize(schema.__.name)] &&
      isSchema(schemaField.type.values[camelize(schema.__.name)].type);
      const { schemaFieldType , commonFieldType, complexSchemaFieldType } = DomainSchemaFormik.getDefaultFormFieldTypes();
      if (oneToOne || schemaField.fieldType === complexSchemaFieldType){
        formFields.push(...this.generateFieldComponents(values, schemaField.type, true));
        continue;
      }
      const defaultFormFieldType = isSchema(schemaField.type) ? schemaFieldType : commonFieldType;
      const formFieldType = schemaField.fieldType || defaultFormFieldType;
      const fieldValue = values[fieldName] || schemaField.defaultValue || '';
      if ((this.fields && this.fields.hasOwnProperty(formFieldType)) ||
        DomainSchemaFormik.fields.hasOwnProperty(formFieldType)) {
        formFields.push(
          this.genField(
            (this.fields && this.fields[formFieldType]) || DomainSchemaFormik.fields[formFieldType],
            schemaField,
            fieldValue,
            fieldName,
            isSchema(schemaField.type) ? schemaField.type : null
          )
        );
      } else {
        throw new Error(`${fieldName} has wrong field type`);
      }
    }
    return formFields;
  }

  /**
   * Generates form field
   * @param {FormFieldType} formFieldType
   * @param {FSF} schemaField
   * @param {string | number | boolean} value
   * @param {string} fieldName
   * @param schema
   * @returns {any}
   */
  private genField (
    formFieldType: FormFieldType,
    schemaField: FSF,
    value: string | number | boolean,
    fieldName: string,
    schema: any
  ) {
    const props = {
      key: fieldName,
      name: fieldName,
      attributes: schemaField.input || {},
      fieldType: formFieldType.name,
      component: formFieldType.component || schemaField.component,
      value,
      schema
    };
    return <Field {...props} />;
  }

  /**
   * Transform object with nested errors to valid formik errors object
   * @param {object} rawErrors
   * @param {string} requiredMessage
   * @returns {object}
   */
  public static transformErrors(rawErrors: object, requiredMessage: string): object {
    let computedErrors = {};

    const collectNestedErrors = (nestedRawErrors, computedNestedErrors) => {
      for (const nestedRawErrorField in nestedRawErrors) {
        if (nestedRawErrors.hasOwnProperty(nestedRawErrorField) &&
          typeof nestedRawErrors[nestedRawErrorField] === 'object') {
          if (computedNestedErrors.indexOf(pascalize(nestedRawErrorField)) >= 0) {
            continue;
          }
          computedNestedErrors.push(pascalize(nestedRawErrorField));
          collectNestedErrors(nestedRawErrors[nestedRawErrorField], computedNestedErrors);
        }
      }
      return computedNestedErrors;
    };

    for (const errorField in rawErrors) {
      if (rawErrors.hasOwnProperty(errorField) && typeof rawErrors[errorField] === 'object') {
        // collect only nested schema which has errors fields
        const nestedErrors = collectNestedErrors(rawErrors[errorField], [pascalize(errorField)]);
        computedErrors[errorField] = requiredMessage + nestedErrors.join(', ');
      } else {
        if (errorField === 'id') {
          continue;
        }
        // collect field with error
        computedErrors[errorField] =
          Array.isArray(rawErrors[errorField]) && rawErrors[errorField].length > 0
            ? rawErrors[errorField][0]
            :  rawErrors[errorField];
      }
    }
    return computedErrors;
  }

  /**
   * Generates buttons
   * @param {ButtonsConfig | any} buttonsConfig
   * @param {boolean} valid
   * @param {() => void} handleReset
   * @returns {React.ReactElement<any>}
   */
  private genButtons(buttonsConfig: ButtonsConfig | any, valid: boolean, handleReset: () => void): ReactElement<any> {
    let { submit } = buttonsConfig;
    const { reset } = buttonsConfig;
    if (!submit) {
      if (Object.keys(buttonsConfig).length) {
        submit = buttonsConfig;
      } else {
        submit = {
          label: 'Save',
          disableOnInvalid: true
        };
      }
    }
    if (!submit.hasOwnProperty('disableOnInvalid')) {
      submit.disableOnInvalid = true;
    }
    const { label, disableOnInvalid, ...submitProps } = submit;
    if (disableOnInvalid) {
      submitProps.disabled = !valid;
    }

    const styles: CSSProperties = {
      display: 'flex',
      flex: 1,
      justifyContent: reset
        ? (submitProps.align === 'left' && reset.align !== 'right') || (reset.align === 'left' && !submitProps.align)
          ? 'flex-start'
          : (submitProps.align === 'right' && reset.align !== 'left') || (reset.align === 'right' && !submitProps.align)
            ? 'flex-end'
            : (submitProps.align === 'right' && reset.align === 'left') ||
              (reset.align === 'right' && submitProps.align === 'left')
              ? 'space-between'
              : 'center'
        : submitProps.align === 'left' ? 'flex-start' : submitProps.align === 'right' ? 'flex-end' : 'center'
    };
    const Button =
      (this.formComponents.button && this.formComponents.button.component) ||
      (DomainSchemaFormik.formComponents.button && DomainSchemaFormik.formComponents.button.component);
    return (
      <div key="formButtons" style={styles}>
        {submit && (
          <Button type="submit" {...submitProps}>
            {label}
          </Button>
        )}
        {reset && (
          <Button type="reset" {...reset} onClick={handleReset}>
            {reset.label}
          </Button>
        )}
      </div>
    );
  }
}
