## Domain Schema Auto React Forms

[![npm version](https://badge.fury.io/js/domain-react-forms.svg)](https://badge.fury.io/js/domain-react-forms) [![Twitter Follow](https://img.shields.io/twitter/follow/sysgears.svg?style=social)](https://twitter.com/sysgears)

## Installation

```bash
npm install domain-react-forms
```
or
```bash
yarn add domain-react-forms
```
## Usage 
### Example
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

### Built-in validators

  * required - Non empty validation
  * match - Match a particular field
  * maxLength - Max length validation
  * minLength - Min length validation
  * numberCheck - Number validation
  * minValue - Min value validation
  * email - Email validation
  * alphaNumeric - Alpha numeric validation
  * phoneNumber - Phone number validation
  * equals - Equals validation

### Customizing Validation Messages
To set default messages to be used by all DomainReactForms instances use ``` setValidationMessages ``` function and pass on object with key as name of validator and value
as message:
```js
    DomainReactForms.setValidationMessages({
      required: 'This field is required',
      numberCheck: 'Error! Not a number!'
    });
```
or as callback function:
```js
    DomainReactForms.setValidationMessages({
      required: ({field}) => {
        return `Field '${field}' is required`
      },
      numberCheck: ({values, field}) => {
        return `Error! '${values[field]}' is not a number`
      }
    });
```
Where as argument there is an object which provides the following properties:
  * values - the validation object
  * field - the name of current field
  * schema - the domain schema definition object

To add a custom validation message for **specific field**, define it in schema:
```js
    ...
    name = {
        type: String,
        required: {
          value: true,
          msg: 'Required Name'
        }
    }
    ...
```

### Custom validators

To add a custom validation function you need to pass it on as ```validators``` property
for field into schema:
```js
    password = {
        type: String,
        required: true,
        validators: [(value, values) => {
          return value.length > 3 ? undefined : 'Must Be more than 3 characters';
        }]
    };
```
  As arguments callback receive:
  * value - the value to validate
  * values - the validation object
  
NOTE: Function must return a string with error message or undefined. 

## License
Copyright © 2017 [SysGears INC]. This source code is licensed under the [MIT] license.

[MIT]: LICENSE
[SysGears INC]: http://sysgears.com
