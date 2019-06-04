import DomainSchema, { Schema } from '@domain-schema/core';
import DomainValidation from '../index';

describe('DomainValidator', () => {
  it('should validate simple schema', () => {
    const schema = new DomainSchema(
      class extends Schema {
        public __ = { name: 'User' };
        public id = DomainSchema.Int;
        public username = {
          type: String
        };
        public email = {
          type: String,
          email: true
        };
        public pass = {
          type: String,
          min: 5
        };
        public confPass = {
          type: String,
          matches: 'pass'
        };
      }
    );
    const errors = DomainValidation.validate(schema, {
      username: '',
      email: 'test@email.com',
      pass: '123456',
      confPass: '123'
    });
    expect(errors).toHaveProperty('username');
    expect(errors).toHaveProperty('confPass');
  });

  it('should validate nested schema', () => {
    class Profile extends Schema {
      public __ = { name: 'Profile' };
      public firstName = {
        type: String
      };
      public lastName = {
        type: String,
        optional: true
      };
    }
    const schema = new DomainSchema(
      class extends Schema {
        public __ = { name: 'User' };
        public id = DomainSchema.Int;
        public login = {
          type: String,
          min: 3
        };
        public profile = {
          type: Profile
        };
      }
    );
    const errors = DomainValidation.validate(schema, {
      id: 1,
      login: 'user',
      profile: {
        firstName: '',
        lastName: ''
      }
    });
    expect(errors).toEqual({ profile: { firstName: 'Required' } });
  });

  it('should redefine error message for all fields', () => {
    const schema = new DomainSchema(
      class extends Schema {
        public __ = { name: 'User' };
        public id = DomainSchema.Int;
        public login = {
          type: String
        };
        public pass = {
          type: String
        };
      }
    );
    DomainValidation.setValidationMessages({
      required: ({ fieldName }) => {
        return `Field ${fieldName} is required!`;
      }
    });
    const errors = DomainValidation.validate(schema, {
      id: 1,
      login: '',
      pass: ''
    });
    expect(errors).toEqual({ login: 'Field login is required!', pass: 'Field pass is required!' });
  });

  it('should redefine error message for specified field', () => {
    const schema = new DomainSchema(
      class extends Schema {
        public __ = { name: 'User' };
        public id = DomainSchema.Int;
        public login = {
          type: String
        };
        public pass = {
          type: String,
          required: {
            value: true,
            msg: 'Password is required!'
          }
        };
      }
    );
    const errors = DomainValidation.validate(schema, {
      id: 1,
      login: 'admin',
      pass: ''
    });
    expect(errors).toEqual({ pass: 'Password is required!' });
  });

  it('should support custom validators', () => {
    const schema = new DomainSchema(
      class extends Schema {
        public __ = { name: 'User' };
        public id = DomainSchema.Int;
        public login = {
          type: String
        };
        public pass = {
          type: String,
          validators: [
            value => {
              return value.length > 5 ? undefined : 'Must Be more than 5 characters';
            }
          ]
        };
      }
    );
    const errors = DomainValidation.validate(schema, {
      id: 1,
      login: 'admin',
      pass: '123'
    });
    expect(errors).toEqual({ pass: 'Must Be more than 5 characters' });
  });
});
