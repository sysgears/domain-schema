import { Schema } from '@domain-schema/core';
import { SchemaField } from '../../index';

export default class extends Schema {
  public __ = { name: 'User' };
  public username: SchemaField = {
    type: String,
    input: {
      label: 'Username',
      placeholder: 'name'
    },
    defaultValue: 'John'
  };
  public email: SchemaField = {
    type: String,
    input: {
      type: 'email',
      label: 'Email'
    }
  };
  public pass: SchemaField = {
    type: String,
    input: {
      type: 'password',
      label: 'Password'
    }
  };
}
