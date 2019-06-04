import DomainSchema, { Schema } from '@domain-schema/core';
import { SchemaField } from '../../index';

export class Group extends Schema {
  public __ = { name: 'Group' };
  public id: SchemaField = {
    type: DomainSchema.Int
  };
  public name: SchemaField = {
    type: String,
    input: {
      label: 'Group Name'
    }
  };
  public description: SchemaField = {
    type: String
  };
  public users: SchemaField = {
    type: [User]
  };
}
export class User extends Schema {
  public __ = { name: 'User' };
  public id: SchemaField = {
    type: DomainSchema.Int
  };
  public name: SchemaField = {
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
    }
  };
  public group = {
    type: Group
  };
  public password: SchemaField = {
    type: String,
    input: {
      type: 'password',
      label: 'Password'
    },
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
