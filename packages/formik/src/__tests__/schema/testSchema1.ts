import { Schema } from '@domain-schema/core';
import { FSF } from '../../index';

export default class extends Schema {
  public __ = { name: 'User' };
  public username: FSF = {
    type: String,
    input: {
      label: 'Username',
      placeholder: 'name'
    },
    defaultValue: 'John'
  };
  public email: FSF = {
    type: String,
    input: {
      type: 'email',
      label: 'Email'
    }
  };
  public pass: FSF = {
    type: String,
    input: {
      type: 'password',
      label: 'Email'
    }
  };
  public isActive: FSF = {
    type: String,
    fieldType: 'checkbox',
    input: {
      label: 'Is Active'
    },
    defaultValue: true
  };
}
