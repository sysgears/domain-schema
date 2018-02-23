import DomainSchema from '@domain-schema/core';
import DomainValidator from '@domain-schema/validation';
import * as React from 'react';
import { Button, Field, Form, RenderCheckBox, RenderField, RenderRadio, RenderSelect } from './components';

export const input = 'input';
export const select = 'select';
export const checkbox = 'checkbox';
export const radio = 'radio';
export const button = 'button';

export default class DomainReactForms {
  constructor(private schema: DomainSchema) {}

  public validate(formValues: any) {
    return DomainValidator.validate(formValues, this.schema);
  }

  public generateForm(initModel: any, options?: any) {
    const result = [];
    const validateSchema = (schema, model, collector) => {
      Object.keys(schema)
        .filter(field => schema.hasOwnProperty(field))
        .forEach(field => {
          if (field === 'id') {
            return;
          }
          const s = schema[field];
          if (!s.type.isSchema) {
            const m = this.filter(model[field], s.atrs);
            switch (s.fieldType) {
              case input: {
                collector.push(this.genInput(s, m, field));
                break;
              }
              case select: {
                collector.push(this.genSelect(s, m, field));
                break;
              }
              case checkbox: {
                collector.push(this.genCheck(s, m, field));
                break;
              }
              case radio: {
                collector.push(this.genRadio(s, m, field));
                break;
              }
              case button: {
                collector.push(this.genButton(s, m, field));
                break;
              }
              default: {
                collector.push(this.genCustomField(s, m, field));
              }
            }
          } else {
            validateSchema(schema[field].type.values, model[field], collector);
          }
        });
      return collector;
    };
    return <Form {...options}>{validateSchema(this.schema.values, initModel, result)}</Form>;
  }

  public static setValidationMessages(messages) {
    DomainValidator.setValidationMessages(messages);
  }

  private genInput(ctx, model, field) {
    return <Field key={field} {...model} component={RenderField} options={ctx.parentAtrs} />;
  }

  private genSelect(ctx, model, field) {
    return <Field key={field} {...model} component={RenderSelect} type="select" options={ctx.parentAtrs} />;
  }

  private genCheck(ctx, model, field) {
    return <Field key={field} {...model} component={RenderCheckBox} type="checkbox" options={ctx.parentAtrs} />;
  }

  private genButton(ctx, model, field) {
    return (
      <Button key={field} {...model}>
        {ctx.label}
      </Button>
    );
  }

  private genRadio(ctx, model, field) {
    return <Field key={field} {...model} component={RenderRadio} type="radio" options={ctx.parentAtrs} />;
  }

  private genCustomField(ctx, model, field) {
    return <Field key={field} {...model} component={ctx.fieldType} options={ctx.parentAtrs} />;
  }

  private filter(model, schema) {
    const result = {};
    for (const key in model) {
      if (model.hasOwnProperty(key) && schema.includes(key)) {
        result[key] = model[key];
      }
    }
    return result;
  }
}
