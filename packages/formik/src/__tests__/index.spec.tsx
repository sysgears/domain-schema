import DomainSchema, { Schema } from '@domain-schema/core';
import { FieldValidators } from '@domain-schema/validation';
import * as React from 'react';
import renderer from 'react-test-renderer';

import { DomainSchemaFormik, FieldTypes, FormSchema, FSF } from '../';
import { Button, Form, RenderCheckBox, RenderField, RenderSelect } from '../components';

DomainSchemaFormik.setFormComponents({
  input: RenderField,
  checkbox: RenderCheckBox,
  select: RenderSelect,
  button: Button,
  form: Form
});

describe('DomainFormik', () => {
  it('should generate simple form', () => {
    const schema = new DomainSchema(
      class extends FormSchema {
        public __ = { name: 'User' };
        public username: FSF = {
          type: String,
          fieldType: DomainSchemaFormik.fields.input,
          input: {
            label: 'Username',
            placeholder: 'name'
          },
          defaultValue: 'John'
        };
        public email: FSF = {
          type: String,
          fieldType: DomainSchemaFormik.fields.input,
          input: {
            type: 'email',
            label: 'Email'
          }
        };
        public pass: FSF = {
          type: String,
          fieldType: DomainSchemaFormik.fields.input,
          input: {
            type: 'password',
            label: 'Email'
          }
        };
        public isActive: FSF = {
          type: String,
          fieldType: DomainSchemaFormik.fields.checkbox,
          input: {
            label: 'Is Active'
          },
          defaultValue: true
        };
      }
    );
    const form = new DomainSchemaFormik(schema);
    const FormComponent = form.generateForm();
    const component = renderer.create(<FormComponent onSubmit={() => null} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should generate complex form', () => {
    class Profile extends Schema {
      public __ = { name: 'Profile' };
      public firstName: FSF = {
        type: String,
        fieldType: DomainSchemaFormik.fields.input,
        input: {
          label: 'First Name'
        },
        defaultValue: 'Ashley',
        required: {
          value: true,
          msg: 'Required First Name'
        }
      };
      public lastName: FSF = {
        type: String,
        fieldType: DomainSchemaFormik.fields.input,
        input: {
          label: 'Last Name'
        },
        required: true
      };
    }
    const schema = new DomainSchema(
      class User extends FormSchema {
        public __ = { name: 'User' };
        public username: FSF = {
          type: String,
          fieldType: DomainSchemaFormik.fields.input,
          input: {
            type: 'text',
            label: 'Username'
          },
          defaultValue: 'User',
          required: true,
          validators: [
            value => {
              return value.length > 3 ? undefined : 'Must Be more than 3 characters';
            }
          ]
        };
        public email: FSF = {
          type: String,
          fieldType: DomainSchemaFormik.fields.input,
          input: {
            type: 'email',
            label: 'Email',
            placeholder: 'User email'
          },
          required: true,
          email: true
        };
        public profile = {
          type: Profile
        };
        public password: FSF = {
          type: String,
          fieldType: DomainSchemaFormik.fields.input,
          input: {
            type: 'password',
            label: 'Password'
          },
          required: true,
          min: 5
        };
        public passwordConfirmation: FSF = {
          type: String,
          fieldType: DomainSchemaFormik.fields.input,
          input: {
            type: 'password',
            label: 'Password Confirmation'
          },
          matches: 'password'
        };
        public setSubmitBtn(): any {
          return {
            label: 'Submit',
            autovalidate: true
          };
        }
      }
    );
    const userForm = new DomainSchemaFormik(schema);
    const FormComponent = userForm.generateForm();
    const component = renderer.create(<FormComponent onSubmit={() => null} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should generate form with custom field', () => {
    const MyComponent = ({ input: { name, label, value, className, ...attrs } }) => {
      return (
        <div>
          <input {...attrs} type="text" name={name} placeholder={label} value={value} className={className} />
        </div>
      );
    };
    const schema = new DomainSchema(
      class User extends FormSchema {
        public __ = { name: 'User' };
        public username: FSF = {
          type: String,
          fieldType: DomainSchemaFormik.fields.input,
          input: {
            inputType: 'text',
            label: 'Username'
          },
          defaultValue: 'User'
        };
        public userfield: FSF = {
          type: String,
          fieldType: DomainSchemaFormik.fields.custom,
          component: MyComponent,
          input: {
            label: 'User Field',
            className: 'my-awesome-field'
          },
          defaultValue: 'my field'
        };
        public setSubmitBtn(): any {
          return {
            label: 'Submit'
          };
        }
      }
    );
    const userForm = new DomainSchemaFormik(schema);
    const FormComponent = userForm.generateForm();
    const component = renderer.create(<FormComponent onSubmit={() => null} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
