import { Schema } from '@domain-schema/core';
import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { DomainSchemaFormik, SchemaField } from '../';
import { Button, Form, RenderCheckBox, RenderField, RenderSelect, RenderSelectQuery } from './components';
import UserTestSchema1 from './schema/testSchema1';
import { User as UserTestSchema2 } from './schema/testSchema2';
import { User as UserTestSchema3 } from './schema/testSchema3';
import UserTestSchema4 from './schema/testSchema4';

DomainSchemaFormik.setFormComponents({
  input: RenderField,
  checkbox: RenderCheckBox,
  select: RenderSelect,
  button: Button,
  form: Form
});

describe('DomainFormik', () => {
  it('should generate simple form', () => {
    const form = new DomainSchemaFormik(UserTestSchema1);
    const FormComponent = form.generateForm();
    const component = renderer.create(<FormComponent onSubmit={() => null} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should generate complex form with schema select field', () => {
    const userForm = new DomainSchemaFormik(UserTestSchema2);
    userForm.setFormComponents({
      select: RenderSelectQuery
    });
    const FormComponent = userForm.generateForm({
      label: 'Submit',
      disableOnInvalid: false
    });
    const component = renderer.create(<FormComponent onSubmit={() => null} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should generate complex form with one-to-one nested schema field relation', () => {
    const userForm = new DomainSchemaFormik(UserTestSchema3);
    const FormComponent = userForm.generateForm({
      label: 'Submit'
    });
    const component = renderer.create(<FormComponent onSubmit={() => null} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should generate form with custom field', () => {
    const MyComponent = ({ input: { name, value, className, ...attrs }, label }) => {
      return (
        <div>
          <input {...attrs} type="text" name={name} placeholder={label} value={value} className={className} />
        </div>
      );
    };
    const schema = class User extends Schema {
      public __ = { name: 'User' };
      public username: SchemaField = {
        type: String,
        input: {
          label: 'Username'
        },
        defaultValue: 'User'
      };
      public userfield: SchemaField = {
        type: String,
        fieldType: 'custom',
        component: MyComponent,
        input: {
          label: 'User Field',
          className: 'my-awesome-field'
        },
        defaultValue: 'my field'
      };
    };

    const userForm = new DomainSchemaFormik(schema);
    const FormComponent = userForm.generateForm({
      label: 'Submit'
    });
    const component = renderer.create(<FormComponent onSubmit={() => null} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should allow to set UI toolkit for particular instance', () => {
    const MyInputComponent = ({ input: { name, value, className, ...attrs }, label }) => {
      return (
        <div>
          <input
            {...attrs}
            type="text"
            name={'custom_' + name}
            placeholder={label}
            value={value}
            className={className}
          />
        </div>
      );
    };
    const form = new DomainSchemaFormik(UserTestSchema4);
    form.setFormComponents({
      input: MyInputComponent
    });
    const FormComponent = form.generateForm();
    const component = renderer.create(<FormComponent onSubmit={() => null} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
