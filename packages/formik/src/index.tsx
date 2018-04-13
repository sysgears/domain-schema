import DomainSchema, { Schema } from '@domain-schema/core';
import DomainValidator, { FieldValidators } from '@domain-schema/validation';
import { FormikProps, withFormik } from 'formik';
import React, { ComponentType, ReactElement } from 'react';

import { Button, Field, Form, RenderCheckBox, RenderField, RenderRadio, RenderSelect } from './components';
import FieldTypes from './fieldTypes';
import { FSF } from './types';

export default class DomainReactForms {
  private handleSubmit;
  private configFormik = {
    mapPropsToValues: () => this.getValuesFromSchema(),
    handleSubmit: this.handleSubmit,
    validate: (values: any) => this.validate(values)
  };

  constructor(private schema: DomainSchema) {}

  public validate(formValues: any) {
    return DomainValidator.validate(formValues, this.schema);
  }

  public generateForm(handleSubmit: any, formAttrs?: any) {
    return withFormik(this.configFormik)(({ values, isValid }: FormikProps<any>) => {
      this.handleSubmit = handleSubmit;
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
              switch (schemaField.fieldType) {
                case FieldTypes.input: {
                  collector.push(
                    this.genField(RenderField, schemaField, fieldValue, fieldName, {
                      name: parent,
                      value: values[parent]
                    })
                  );
                  break;
                }
                case FieldTypes.select: {
                  collector.push(this.genField(RenderSelect, schemaField, fieldValue, fieldName));
                  break;
                }
                case FieldTypes.checkbox: {
                  collector.push(this.genField(RenderCheckBox, schemaField, fieldValue, fieldName));
                  break;
                }
                case FieldTypes.radio: {
                  collector.push(this.genField(RenderRadio, schemaField, fieldValue, fieldName));
                  break;
                }
                case FieldTypes.custom: {
                  collector.push(this.genField(schemaField.component, schemaField, fieldValue, fieldName));
                  break;
                }
                default: {
                  throw new Error(`${fieldName} has wrong field type`);
                }
              }
            } else {
              generate(schema[fieldName].type.values, fieldName, collector);
            }
          });
        return collector;
      };
      const formElements = generate(this.schema.values, null, []);
      formElements.push(this.genButtons(this.schema.schema, isValid));
      return (
        <Form handleSubmit={this.handleSubmit} name={this.schema.name} input={formAttrs}>
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
    component: ComponentType<any>,
    ctx: FSF,
    value: string | number | boolean,
    fieldName: string,
    parent?: any
  ) {
    const props = {
      key: fieldName,
      name: fieldName,
      attrs: ctx.input,
      options: ctx.fieldAttrs,
      fieldType: ctx.fieldType === 'input' ? 'text' : ctx.fieldType,
      component,
      parent
    };
    props[ctx.fieldType === FieldTypes.checkbox ? 'checked' : 'value'] = value;
    return <Field {...props} />;
  }

  private genButtons(schema: Schema, valid: boolean): ReactElement<any> {
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
          <Button type="reset" {...reset}>
            {reset.label}
          </Button>
        )}
      </div>
    );
  }
}

export { default as FieldTypes } from './fieldTypes';
