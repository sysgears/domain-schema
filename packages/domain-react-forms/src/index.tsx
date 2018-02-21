import DomainSchema from 'domain-schema';
import DomainValidator from 'domain-schema-validation';
import * as React from 'react';
import { Button, Field, Form, Option, RenderCheckBox, RenderField, RenderSelect } from './components';

export const input = 'input';
export const select = 'select';
export const checkbox = 'checkbox';
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
    return (
      <Field key={field} {...ctx.atrs} component={RenderSelect} type="select">
        {ctx.options.map(option => {
          return option.value ? (
            <Option key={option.value} value={option.value}>
              {option.key}
            </Option>
          ) : (
            <Option key={option} value={option}>
              {option}
            </Option>
          );
        })}
      </Field>
    );
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

  private genCustomField(ctx, field) {
    // not yet implemented
  }
}
