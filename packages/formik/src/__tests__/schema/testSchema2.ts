import DomainSchema, { Schema } from '@domain-schema/core';
import { FSF } from '../../index';

export class Group extends Schema {
  public __ = { name: 'Group' };
  public id: FSF = {
    type: DomainSchema.Int
  };
  public name: FSF = {
    type: String,
    input: {
      label: 'Group Name'
    }
  };
  public description: FSF = {
    type: String
  };
  public users: FSF = {
    type: [User]
  };
}
export class User extends Schema {
  public __ = { name: 'User' };
  public id: FSF = {
    type: DomainSchema.Int
  };
  public name: FSF = {
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
  public email: FSF = {
    type: String,
    input: {
      type: 'email',
      label: 'Email',
      placeholder: 'User email'
    }
  };
  public group = {
    type: Group
  };
  public password: FSF = {
    type: String,
    input: {
      type: 'password',
      label: 'Password'
    },
    min: 5
  };
  public passwordConfirmation: FSF = {
    type: String,
    input: {
      type: 'password',
      label: 'Password Confirmation'
    },
    matches: 'password'
  };
}
