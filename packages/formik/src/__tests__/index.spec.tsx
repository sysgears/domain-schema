import DomainSchema, { Schema } from '@domain-schema/core';
import * as React from 'react';
import renderer from 'react-test-renderer';
import DomainReactForms, { FieldTypes } from '../';

describe('DomainFormik', () => {
  it('should generate simple form', () => {
    const schema = new DomainSchema(
      class extends Schema {
        public __ = { name: 'User' };
        public id = DomainSchema.Int;
        public username = {
          type: String,
          fieldType: FieldTypes.input,
          attrs: {
            label: 'Username'
          },
          defaultValue: 'John'
        };
        public email = {
          type: String,
          fieldType: FieldTypes.input,
          attrs: {
            type: 'email',
            label: 'Email'
          }
        };
        public pass = {
          type: String,
          fieldType: FieldTypes.input,
          attrs: {
            type: 'password',
            label: 'Email'
          }
        };
        public isActive = {
          type: String,
          fieldType: FieldTypes.checkbox,
          attrs: {
            label: 'Is Active'
          },
          defaultValue: true
        };
      }
    );
    const form = new DomainReactForms(schema);
    const FormComponent = form.generateForm(() => null);
    const component = renderer.create(<FormComponent />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
