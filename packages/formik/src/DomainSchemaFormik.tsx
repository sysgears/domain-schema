import DomainSchema, { Schema } from '@domain-schema/core';
import DomainValidator, { FieldValidators } from '@domain-schema/validation';
import { FormikProps, withFormik } from 'formik';
import * as React from 'react';
import { ComponentType, CSSProperties, ReactElement } from 'react';

import Field from './FieldAdapter';
import { ButtonsConfig, FormFieldType, FSF } from './types';

export default class DomainSchemaFormik {
  private static fields: any = {
    custom: {
      name: 'custom'
    }
  };
  private static defaultFormFieldTypes = {
    schemaFieldType: 'select',
    commonFieldType: 'input'
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
    //validate: (values: any) => this.validate(values)
  };

  /**
   * @param {} schema
   */
  constructor(private schema: Schema) {
    this.schema = new DomainSchema(schema);
  }

  /**
   * @param {string} schemaFieldType
   * @param {string} commonFieldType
   */
  public static setDefaultFormFieldTypes (schemaFieldType: string, commonFieldType: string): void{
    DomainSchemaFormik.defaultFormFieldTypes  = {
      schemaFieldType,
      commonFieldType
    }
  }

  /**
   * @returns {object}
   */
  public static getDefaultFormFieldTypes () {
    return DomainSchemaFormik.defaultFormFieldTypes;
  }

  /**
   * Trigger fields validation
   * @param formValues
   * @returns {any}
   */
  public validate(formValues: any) {
    return DomainValidator.validate(this.schema, formValues);
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
   * @returns {any[]}
   */
  private generateFieldComponents(values: any, schema: DomainSchema) {
    let formFields = [];
    for (const fieldName of schema.keys()){
      if (fieldName === 'id' || schema.values[fieldName].ignore) {
        continue;
      }
      const schemaField: FSF = schema.values[fieldName];
      const type = Array.isArray(schemaField.type) ? schemaField.type[0] : schemaField.type;
      const isSchema = type instanceof DomainSchema;
      const { schemaFieldType , commonFieldType } = DomainSchemaFormik.getDefaultFormFieldTypes();
      const defaultFormFieldType = isSchema ? schemaFieldType : commonFieldType;
      const formFieldType = schemaField.fieldType || defaultFormFieldType;
      const fieldValue = values[fieldName];
      const nestedSchema = isSchema ? type : null;
      if ((this.fields && this.fields.hasOwnProperty(formFieldType)) ||
        DomainSchemaFormik.fields.hasOwnProperty(formFieldType)) {
        formFields.push(
          this.genField(
            (this.fields && this.fields[formFieldType]) || DomainSchemaFormik.fields[formFieldType],
            schemaField,
            fieldValue,
            fieldName,
            nestedSchema
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
      attrs: schemaField.input,
      fieldType: formFieldType.name,
      component: formFieldType.component || schemaField.component,
      value,
      schema
    };
    return <Field {...props} />;
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
