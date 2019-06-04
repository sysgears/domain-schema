import { Schema } from '@domain-schema/core';
import { SchemaField } from '../../index';

export class Profile extends Schema {
  public __ = { name: 'Profile' };
  public firstName: SchemaField = {
    type: String,
    input: {
      label: 'First Name'
    },
    defaultValue: 'Ashley',
    required: {
      value: true,
      msg: 'Required First Name'
    }
  };
  public lastName: SchemaField = {
    type: String,
    input: {
      label: 'Last Name'
    },
    required: true
  };

  public user: SchemaField = {
    type: User
  };
}
export class User extends Schema {
  public __ = { name: 'User' };
  public username: SchemaField = {
    type: String,
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
  public email: SchemaField = {
    type: String,
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
  public password: SchemaField = {
    type: String,
    input: {
      type: 'password',
      label: 'Password'
    },
    required: true,
    min: 5
  };
  public passwordConfirmation: SchemaField = {
    type: String,
    input: {
      type: 'password',
      label: 'Password Confirmation'
    },
    matches: 'password'
  };
}
