import DomainSchema, { Schema } from '@domain-schema/core';
import DomainValidator, { FieldValidators } from '@domain-schema/validation';
import { FormikProps, withFormik } from 'formik';
import * as React from 'react';
import { ComponentType, ReactElement } from 'react';

import { Button, Field, Form } from './components';
import FieldTypes from './fieldTypes';
import { FieldType, FSF } from './types';

export default class DomainSchemaFormik {
  private handleSubmit;
  private configFormik = {
    enableReinitialize: true,
    mapPropsToValues: () => this.getValuesFromSchema(),
    handleSubmit(values, { props: { onSubmit } }) {
      onSubmit(values);
    },
    validate: (values: any) => this.validate(values)
  };

  constructor(private schema: DomainSchema) {}

  public validate(formValues: any) {
    return DomainValidator.validate(formValues, this.schema);
  }

  public generateForm(formAttrs?: any) {
    return withFormik(this.configFormik)(({ values, isValid, handleReset, handleSubmit }: FormikProps<any>) => {
      const generate = (schema: DomainSchema, parent: string, collector: any[]) => {
        Object.keys(schema)
          .filter(schemaProp => schema.hasOwnProperty(schemaProp))
          .forEach((fieldName: string) => {
            if (fieldName === 'id') {
              return;
            }
            const schemaField: FSF = schema[fieldName];
            if (!schemaField.type.isSchema) {
              const fieldValue = parent ? values[parent][fieldName] : values[fieldName];
              if (FieldTypes.hasOwnProperty(schemaField.fieldType.name)) {
                collector.push(
                  this.genField(FieldTypes[schemaField.fieldType.name], schemaField, fieldValue, fieldName, {
                    name: parent,
                    value: values[parent]
                  })
                );
              } else {
                throw new Error(`${fieldName} has wrong field type`);
              }
            } else {
              generate(schema[fieldName].type.values, fieldName, collector);
            }
          });
        return collector;
      };
      const formElements = generate(this.schema.values, null, []);
      formElements.push(this.genButtons(this.schema.schema, isValid, handleReset));
      return (
        <Form handleSubmit={handleSubmit} name={this.schema.name} input={formAttrs}>
          {formElements}
        </Form>
      );
    });
  }

  public static setValidationMessages(messages: any) {
    DomainValidator.setValidationMessages(messages);
  }

  private getValuesFromSchema() {
    const getValues = (schema: Schema, model: any) => {
      Object.keys(schema)
        .filter(schemaProp => schema.hasOwnProperty(schemaProp))
        .forEach((fieldName: string) => {
          if (fieldName === 'id') {
            return;
          }
          const schemaField = schema[fieldName];
          model[fieldName] = schemaField.type.isSchema
            ? getValues(schema[fieldName].type.values, {})
            : schemaField.defaultValue || '';
        });
      return model;
    };
    return getValues(this.schema.values, {});
  }

  private genField(
    fieldType: FieldType,
    schemaField: FSF,
    value: string | number | boolean,
    fieldName: string,
    parent?: any
  ) {
    const props = {
      key: fieldName,
      name: fieldName,
      attrs: schemaField.input,
      options: schemaField.fieldAttrs,
      fieldType: fieldType.name,
      component: fieldType.component || schemaField.component,
      parent
    };
    if (fieldType.name === FieldTypes.checkbox.name) {
      props.attrs.checked = !!value;
    } else {
      props.attrs.value = value || '';
    }
    return <Field {...props} />;
  }

  private genButtons(schema: Schema, valid: boolean, handleReset: () => void): ReactElement<any> {
    let submit = schema.setSubmitBtn();
    if (!submit) {
      submit = {
        label: 'Save',
        autovalidate: false
      };
    }
    const { label, autovalidate, ...submitProps } = submit;
    if (autovalidate) {
      submitProps.disabled = !valid;
    }
    const reset = schema.setResetBtn();
    return (
      <div {...schema.setBtnsWrapperProps()} key="formButtons">
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
