import DomainSchema from '@domain-schema/core';
import DomainValidator from '@domain-schema/validation';
import { withFormik } from 'formik';
import * as React from 'react';
import { Button, Field, Form, RenderCheckBox, RenderField, RenderRadio, RenderSelect } from './components';
import FieldTypes from './fieldTypes';

export default class DomainReactForms {
  private model = {};
  private handleSubmit;
  private confFormik = {
    mapPropsToValues: () => this.model,
    handleSubmit: this.handleSubmit,
    validate: values => this.validate(values)
  };

  constructor(private schema: DomainSchema) {}

  public validate(formValues: any) {
    return DomainValidator.validate(formValues, this.schema);
  }

  public generateForm(handleSubmit, formAttrs?: any) {
    return withFormik(this.confFormik)(({ values }) => {
      this.handleSubmit = handleSubmit;
      const result = [];
      const generate = (schema, model, collector) => {
        Object.keys(schema)
          .filter(field => schema.hasOwnProperty(field))
          .forEach(field => {
            if (field === 'id') {
              return;
            }
            const s = schema[field];
            if (!s.type.isSchema) {
              model[field] = s.attrs.defaultValue || s.attrs.checked || '';
              switch (s.fieldType) {
                case FieldTypes.input: {
                  collector.push(this.genInput(s, values[field], field));
                  break;
                }
                case FieldTypes.select: {
                  collector.push(this.genSelect(s, values[field], field));
                  break;
                }
                case FieldTypes.checkbox: {
                  collector.push(this.genCheck(s, values[field], field));
                  break;
                }
                case FieldTypes.radio: {
                  collector.push(this.genRadio(s, values[field], field));
                  break;
                }
                case FieldTypes.button: {
                  collector.push(this.genButton(s, field));
                  break;
                }
                case FieldTypes.custom: {
                  collector.push(this.genCustomField(s, values[field], field));
                  break;
                }
                default: {
                  throw new Error(`${field} has wrong field type`);
                }
              }
            } else {
              model[field] = {};
              generate(schema[field].type.values, model[field], collector);
            }
          });
        return collector;
      };
      const fields = generate(this.schema.values, this.model, result);
      return <Form {...formAttrs}>{fields}</Form>;
    });
  }

  public static setValidationMessages(messages) {
    DomainValidator.setValidationMessages(messages);
  }

  private genInput(ctx, value, field) {
    return <Field key={field} value={value} {...ctx.attrs} component={RenderField} options={ctx.parentAttrs} />;
  }

  private genSelect(ctx, value, field) {
    return (
      <Field
        key={field}
        value={value}
        {...ctx.attrs}
        component={RenderSelect}
        type="select"
        options={ctx.parentAttrs}
      />
    );
  }

  private genCheck(ctx, value, field) {
    return (
      <Field
        key={field}
        value={value}
        {...ctx.attrs}
        component={RenderCheckBox}
        type="checkbox"
        options={ctx.parentAttrs}
      />
    );
  }

  private genButton(ctx, field) {
    return (
      <Button key={field} {...ctx.attrs}>
        {ctx.label}
      </Button>
    );
  }

  private genRadio(ctx, value, field) {
    return (
      <Field key={field} value={value} {...ctx.attrs} component={RenderRadio} type="radio" options={ctx.parentAttrs} />
    );
  }

  private genCustomField(ctx, value, field) {
    return <Field key={field} value={value} {...ctx.attrs} component={ctx.component} options={ctx.parentAttrs} />;
  }
}

export { default as FieldTypes } from './fieldTypes';
