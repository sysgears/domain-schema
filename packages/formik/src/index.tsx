import DomainSchema from 'domain-schema';
import DomainValidator from 'domain-schema-validation';
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

  public generateForm(options?: any) {
    const result = [];
    const validateSchema = (schema, collector) => {
      Object.keys(schema)
        .filter(field => schema.hasOwnProperty(field))
        .forEach(field => {
          if (field === 'id') {
            return;
          }
          const s = schema[field];
          if (!s.type.isSchema) {
            switch (s.fieldType) {
              case input: {
                collector.push(this.genInput(s, field));
                break;
              }
              case select: {
                collector.push(this.genSelect(s, field));
                break;
              }
              case checkbox: {
                collector.push(this.genCheck(s, field));
                break;
              }
              case radio: {
                collector.push(this.genRadio(s, field));
                break;
              }
              case button: {
                collector.push(this.genButton(s, field));
                break;
              }
              default: {
                collector.push(this.genCustomField(s, field));
              }
            }
          } else {
            validateSchema(schema[field].type.values, collector);
          }
        });
      return collector;
    };
    return <Form {...options}>{validateSchema(this.schema.values, result)}</Form>;
  }

  public static setValidationMessages(messages) {
    DomainValidator.setValidationMessages(messages);
  }

  private genInput(ctx, field) {
    return <Field key={field} {...ctx.atrs} component={RenderField} />;
  }

  private genSelect(ctx, field) {
    return <Field key={field} {...ctx.atrs} component={RenderSelect} type="select" values={ctx.values} />;
  }

  private genCheck(ctx, field) {
    return <Field key={field} {...ctx.atrs} component={RenderCheckBox} type="checkbox" />;
  }

  private genButton(ctx, field) {
    return (
      <Button key={field} {...ctx.atrs}>
        {ctx.label}
      </Button>
    );
  }

  private genRadio(ctx, field) {
    return <Field key={field} {...ctx.atrs} component={RenderRadio} type="radio" values={ctx.values} />;
  }

  private genCustomField(ctx, field) {
    return <Field key={field} {...ctx.atrs} component={ctx.fieldType} />;
  }
}
