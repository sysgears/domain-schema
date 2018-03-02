import DomainSchema from '@domain-schema/core';
import DomainValidator from '@domain-schema/validation';
import { withFormik } from 'formik';
import * as React from 'react';
import { Button, Field, Form, RenderCheckBox, RenderField, RenderRadio, RenderSelect } from './components';
import FieldTypes from './fieldTypes';

export default class DomainReactForms {
  private handleSubmit;
  private confFormik = {
    mapPropsToValues: () => this.getValuesFromSchema(),
    handleSubmit: this.handleSubmit,
    validate: values => this.validate(values)
  };

  constructor(private schema: DomainSchema) {}

  public validate(formValues: any) {
    return DomainValidator.validate(formValues, this.schema);
  }

  public generateForm(handleSubmit, formAttrs?: any) {
    return withFormik(this.confFormik)(({ values, isValid }) => {
      this.handleSubmit = handleSubmit;
      const result = [];
      const generate = (schema, parent, collector) => {
        Object.keys(schema)
          .filter(field => schema.hasOwnProperty(field))
          .forEach(field => {
            if (field === 'id') {
              return;
            }
            const s = schema[field];
            if (!s.type.isSchema) {
              const value = parent ? values[parent][field] : values[field];
              switch (s.fieldType) {
                case FieldTypes.input: {
                  collector.push(this.genInput(s, value, field, { name: parent, value: values[parent] }));
                  break;
                }
                case FieldTypes.select: {
                  collector.push(this.genSelect(s, value, field));
                  break;
                }
                case FieldTypes.checkbox: {
                  collector.push(this.genCheck(s, value, field));
                  break;
                }
                case FieldTypes.radio: {
                  collector.push(this.genRadio(s, value, field));
                  break;
                }
                case FieldTypes.button: {
                  collector.push(this.genButton(s, field, isValid));
                  break;
                }
                case FieldTypes.custom: {
                  collector.push(this.genCustomField(s, value, field));
                  break;
                }
                default: {
                  throw new Error(`${field} has wrong field type`);
                }
              }
            } else {
              generate(schema[field].type.values, field, collector);
            }
          });
        return collector;
      };
      const fields = generate(this.schema.values, null, result);
      return (
        <Form name={this.schema.name} {...formAttrs}>
          {fields}
        </Form>
      );
    });
  }

  public static setValidationMessages(messages) {
    DomainValidator.setValidationMessages(messages);
  }

  private getValuesFromSchema() {
    const initModel = {};
    const getValues = (schema, model) => {
      Object.keys(schema)
        .filter(field => schema.hasOwnProperty(field))
        .forEach(field => {
          if (field === 'id') {
            return;
          }
          const s = schema[field];
          if (!s.type.isSchema) {
            model[field] = s.defaultValue || '';
          } else {
            model[field] = {};
            getValues(schema[field].type.values, model[field]);
          }
        });
      return model;
    };
    return getValues(this.schema.values, initModel);
  }

  private genInput(ctx, value, field, parent) {
    return (
      <Field
        key={field}
        value={value}
        parent={parent}
        name={field}
        {...ctx.attrs}
        component={RenderField}
        options={ctx.fieldAttrs}
      />
    );
  }

  private genSelect(ctx, value, field) {
    return (
      <Field
        key={field}
        value={value}
        name={field}
        {...ctx.attrs}
        component={RenderSelect}
        type="select"
        options={ctx.fieldAttrs}
      />
    );
  }

  private genCheck(ctx, value, field) {
    return (
      <Field
        key={field}
        checked={value}
        name={field}
        {...ctx.attrs}
        component={RenderCheckBox}
        type="checkbox"
        options={ctx.fieldAttrs}
      />
    );
  }

  private genButton(ctx, field, valid) {
    return (
      <Button key={field} disabled={!valid} {...ctx.attrs}>
        {ctx.label}
      </Button>
    );
  }

  private genRadio(ctx, value, field) {
    return (
      <Field key={field} value={value} {...ctx.attrs} component={RenderRadio} type="radio" options={ctx.fieldAttrs} />
    );
  }

  private genCustomField(ctx, value, field) {
    return <Field key={field} value={value} {...ctx.attrs} component={ctx.component} options={ctx.fieldAttrs} />;
  }
}

export { default as FieldTypes } from './fieldTypes';
