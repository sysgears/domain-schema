import DomainSchema from '@domain-schema/core';
import DomainValidator from '@domain-schema/validation';
import { withFormik } from 'formik';
import * as React from 'react';
import AvailableButtons from './availableButtons';
import { Button, Field, Form, RenderCheckBox, RenderField, RenderRadio, RenderSelect } from './components';
import FieldTypes from './fieldTypes';

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
    return withFormik(this.configFormik)(({ values, isValid }) => {
      this.handleSubmit = handleSubmit;
      const generate = (schema: DomainSchema, parent: any, collector: any[]) => {
        Object.keys(schema)
          .filter(schemaProp => schema.hasOwnProperty(schemaProp))
          .forEach((fieldName: string) => {
            if (fieldName === 'id' || fieldName === 'buttons') {
              return;
            }
            const schemaField = schema[fieldName];
            if (!schemaField.type.isSchema) {
              const fieldValue = parent ? values[parent][fieldName] : values[fieldName];
              switch (schemaField.fieldType) {
                case FieldTypes.input: {
                  collector.push(
                    this.genInput(schemaField, fieldValue, fieldName, { name: parent, value: values[parent] })
                  );
                  break;
                }
                case FieldTypes.select: {
                  collector.push(this.genSelect(schemaField, fieldValue, fieldName));
                  break;
                }
                case FieldTypes.checkbox: {
                  collector.push(this.genCheck(schemaField, fieldValue, fieldName));
                  break;
                }
                case FieldTypes.radio: {
                  collector.push(this.genRadio(schemaField, fieldValue, fieldName));
                  break;
                }
                case FieldTypes.custom: {
                  collector.push(this.genCustomField(schemaField, fieldValue, fieldName));
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
      formElements.push(this.genButtons(this.schema.__.buttons, isValid));
      return (
        <Form name={this.schema.name} {...formAttrs}>
          {formElements}
        </Form>
      );
    });
  }

  public static setValidationMessages(messages: any) {
    DomainValidator.setValidationMessages(messages);
  }

  private getValuesFromSchema() {
    const getValues = (schema: any, model: any) => {
      Object.keys(schema)
        .filter(schemaProp => schema.hasOwnProperty(schemaProp))
        .forEach((fieldName: string) => {
          if (fieldName === 'id') {
            return;
          }
          const schemaField = schema[fieldName];
          if (!schemaField.type.isSchema) {
            model[fieldName] = schemaField.defaultValue || '';
          } else {
            model[fieldName] = {};
            getValues(schema[fieldName].type.values, model[fieldName]);
          }
        });
      return model;
    };
    return getValues(this.schema.values, {});
  }

  private genInput(ctx: any, value: string, field: string, parent: any) {
    return (
      <Field
        key={field}
        value={value}
        parent={parent}
        name={field}
        attrs={ctx.input}
        component={RenderField}
        options={ctx.fieldAttrs}
      />
    );
  }

  private genSelect(ctx: any, value: string, field: string) {
    return (
      <Field
        key={field}
        value={value}
        fieldType={ctx.fieldType}
        name={field}
        attrs={ctx.input}
        component={RenderSelect}
        options={ctx.fieldAttrs}
      />
    );
  }

  private genCheck(ctx: any, value: boolean, field: string) {
    return (
      <Field
        key={field}
        checked={value}
        name={field}
        fieldType={ctx.fieldType}
        attrs={ctx.input}
        component={RenderCheckBox}
        options={ctx.fieldAttrs}
      />
    );
  }

  private genButtons(schemaButtons: any, valid: boolean) {
    const buttons = schemaButtons && schemaButtons.type;
    return (
      buttons && (
        <div key="actionButtons">
          <Button disabled={!valid} {...buttons[0]}>
            {buttons[0].label}
          </Button>
          {buttons[1] && <Button {...buttons[1]}>{buttons[1].label}</Button>}
        </div>
      )
    );
  }

  private genRadio(ctx: any, value: string, field: string) {
    return (
      <Field
        key={field}
        name={field}
        fieldType={ctx.fieldType}
        value={value}
        attrs={ctx.input}
        component={RenderRadio}
        options={ctx.fieldAttrs}
      />
    );
  }

  private genCustomField(ctx: any, value: any, field: string) {
    return (
      <Field
        key={field}
        name={field}
        value={value}
        attrs={ctx.input}
        component={ctx.component}
        options={ctx.fieldAttrs}
      />
    );
  }
}

export { default as FieldTypes } from './fieldTypes';
