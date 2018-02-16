## Domain Schema Auto React Forms

[![npm version](https://badge.fury.io/js/domain-react-forms.svg)](https://badge.fury.io/js/domain-react-forms) [![Twitter Follow](https://img.shields.io/twitter/follow/sysgears.svg?style=social)](https://twitter.com/sysgears)

## Installation

```bash
npm install -g domain-react-forms
```
##Usage 
```js
const userFormSchema = new DomainSchema(
  class User extends Schema {
    __ = { name: 'User' };
    id = DomainSchema.Int;
    username = {
      type: String,
      required: true,
      validators: [(value) => {
        return value.length > 3 ? undefined : 'Must Be more than 3 characters';
      }]
    };
    email = {
      type: String,
      required: true,
      email: true
    };
    profile = {
      type: Profile
    };
    password = {
      type: String,
      required: true,
      minLength: 5
    };
    passwordConfirmation = {
      type: String,
      required: true,
      minLength: 5,
      match: 'password'
    };
  }
);
class Profile extends Schema {
  __ = { name: 'Profile' };
  firstName = {
    type: String,
    required: {
      value: true,
      msg: 'Required First Name'
    }
  };
  lastName = {
      type: String,
      required: true
  };
};

const userForm =  new DomainReactForms(userFormSchema);

// change error messages
DomainReactForms.setValidationMessages({
  required: ({field}) => {
    return `Field '${field}' is required`
  }
});

const values = {
  // form values
};
const errors = userForm.validate(values);
```
## License
Copyright © 2017 [SysGears INC]. This source code is licensed under the [MIT] license.

[MIT]: LICENSE
[SysGears INC]: http://sysgears.com
