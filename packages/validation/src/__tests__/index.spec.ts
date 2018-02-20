import DomainSchema, { Schema } from '@domain-schema/core';
import DomainValidation from '../index';

describe('DomainValidator', () => {
  it('should validate simple schema', () => {
    const schema = new DomainSchema(
      class extends Schema {
        public __ = { name: 'User' };
        public id = DomainSchema.Int;
        public username = {
          type: String,
          required: true
        };
        public email = {
          type: String,
          email: true
        };
        public pass = {
          type: String,
          required: true,
          minLength: 5
        };
        public confPass = {
          type: String,
          required: true,
          match: 'pass'
        };
      }
    );
    const errors = DomainValidation.validate(
      {
        username: '',
        email: 'test@email.com',
        pass: '123456',
        confPass: '123'
      },
      schema
    );
    expect(errors).toHaveProperty('username');
    expect(errors).toHaveProperty('confPass');
  });

  it('should validate nested schema', () => {
    class Profile extends Schema {
      public __ = { name: 'Profile' };
      public firstName = {
        type: String,
        required: true
      };
      public lastName = {
        type: String
      };
    }
    const schema = new DomainSchema(
      class extends Schema {
        public __ = { name: 'User' };
        public id = DomainSchema.Int;
        public login = {
          type: String,
          minLength: 3
        };
        public profile = {
          type: Profile
        };
      }
    );
    const errors = DomainValidation.validate(
      {
        login: 'user',
        profile: {
          firstName: '',
          lastName: ''
        }
      },
      schema
    );
    expect(errors).toEqual({ firstName: 'Required' });
  });

  it('should redefine error message for all fields', () => {
    const schema = new DomainSchema(
      class extends Schema {
        public __ = { name: 'User' };
        public id = DomainSchema.Int;
        public login = {
          type: String,
          required: true
        };
        public pass = {
          type: String,
          required: true
        };
      }
    );
    DomainValidation.setValidationMessages({
      required: ({ field }) => {
        return `Field ${field} is required!`;
      }
    });
    const errors = DomainValidation.validate(
      {
        login: '',
        pass: ''
      },
      schema
    );
    expect(errors).toEqual({ login: 'Field login is required!', pass: 'Field pass is required!' });
  });

  it('should redefine error message for specified field', () => {
    const schema = new DomainSchema(
      class extends Schema {
        public __ = { name: 'User' };
        public id = DomainSchema.Int;
        public login = {
          type: String,
          required: true
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
    const errors = DomainValidation.validate(
      {
        login: 'admin',
        pass: ''
      },
      schema
    );
    expect(errors).toEqual({ pass: 'Password is required!' });
  });

  it('should support custom validators', () => {
    const schema = new DomainSchema(
      class extends Schema {
        public __ = { name: 'User' };
        public id = DomainSchema.Int;
        public login = {
          type: String,
          required: true
        };
        public pass = {
          type: String,
          required: true,
          validators: [
            value => {
              return value.length > 5 ? undefined : 'Must Be more than 5 characters';
            }
          ]
        };
      }
    );
    const errors = DomainValidation.validate(
      {
        login: 'admin',
        pass: '123'
      },
      schema
    );
    expect(errors).toEqual({ pass: 'Must Be more than 5 characters' });
  });
});
