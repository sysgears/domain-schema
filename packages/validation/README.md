# Domain Schema Validation

[![npm version](https://badge.fury.io/js/domain-react-forms.svg)](https://badge.fury.io/js/domain-react-forms) [![Twitter Follow](https://img.shields.io/twitter/follow/sysgears.svg?style=social)](https://twitter.com/sysgears)

## Installation

```bash
yarn add @domain-schema/validation
```

or

```bash
npm install @domain-schema/validation
```

## Validation

### Built-in validators

* ```optional``` - By default, all keys are required. Set ```optional: true``` to change that.

  ```js
    name = {
      ...
      optional: true,
      ...
    }
  ```

  * ```matches``` - Checks if the value matches some specific field

  ```js
    password = {
      ...
    };
    passwordConfirmation = {
      ...
      matches: 'password',
      ...
    }
  ```

  * ```max``` - Checks if the value or value length does not exceed a specified number
   (works with both numbers and strings)

  ```js
    // Checks length if type is String...
    name = {
      ...
      type: String,
      max: 6,
      ...
    }
    // ...and value when type is Number
    age = {
      ...
      type: Number,
      max: 16,
      ...
    }
  ```

  * ```min``` - Checks if the value or value length not less then a specified number
  (works with both numbers and strings)

  ```js
    // Checks length if type is String...
    name = {
      ...
      type: String,
      min: 6,
      ...
    }
    // ...and value when type is Number
    age = {
      ...
      type: Number,
      min: 16,
      ...
    }
  ```

  * ```email``` - Checks if the value corresponds to an email

  ```js
    name = {
      ...
      email: true,
      ...
    }
  ```

  * ```alphaNumeric``` - Checks if the value consists of alphanumeric characters

  ```js
    text = {
      ...
      alphaNumeric: true,
      ...
    }
  ```

  * ```phoneNumber``` - Checks if the value corresponds to a phone number

  ```js
    phone = {
      ...
      phoneNumber: true,
      ...
    }
  ```

  * ```equals``` - Checks if the value equals to a specific value

  ```js
    role = {
      ...
      equals: 'admin',
      ...
    }
  ```

### Customizing Validation Messages

Validation error messages can be overridden by defining messages in one place as a single
object and passing it to the ```setValidationMessages``` function.
In that object the ``keys`` are validator names and values can be either strings or functions, as follows:

* Values are strings:

```js
    import DomainValidation from '@domain-schema/validation';

    DomainValidation.setValidationMessages({
      required: 'This field is required',
      phoneNumber: 'Error! Not a phone number!'
    });
```

* Values are callback functions:

```js
    import DomainValidation from '@domain-schema/validation';

    DomainValidation.setValidationMessages({
      required: ({fieldName}) => {
        return `Field '${fieldName}' is required`
      },
      phoneNumber: ({values, fieldName}) => {
        return `Error! '${values[fieldName]}' is not a phone number`
      }
    });
```

Callback functions, in turn, get object with the following properties:

* ``values``    - the validation object
* ``fieldName`` - the current field name
* ``schema``    - the domain schema definition object

We can also define a custom validation error message for a **specific field** right in the schema:

```js
    ...
    name = {
        type: String,
        ...
        required: {
          value: true,
          msg: 'Required Name'
        }
    }
    ...
```

### Custom validators

A user is able to add any number of custom validators whenever it need by passing functions to the ```validators```
property of a schema field:

```js
    password = {
        type: String,
        ...
        validators: [(value, values) => {
          return value.length > 3 ? undefined : 'Must Be more than 3 characters';
        }]
    };
```

  Validation callback function gets the following params:
* ``value`` - the value for being validated
* ``values`` - the form object

NOTE: validation function must return a string with an error message or ```undefined```.

## License

Copyright © 2018 [SysGears INC]. This source code is licensed under the [MIT] license.

[MIT]: LICENSE
[SysGears INC]: http://sysgears.com
[View docs]: https://github.com/sysgears/domain-schema/blob/master/packages/formik/README.md
