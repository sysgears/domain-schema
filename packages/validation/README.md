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

Domain Validation intended to check values whether they comply with structure of
 domain schema fields.

### Usage
Firstly import ```DomanValidator``` from domain-schema validation package
```js
    import DomainValidator from '@domain-schema/validation'
```
Then call ```DomanValidator``` static method ```validate``` 
```js
    DomainValidator.validate(schema, values)
```
With such params:
   * ```schema``` - ```DomainSchema``` instance
   * ```values``` - Formatted object from form or another source with values which 
    ```DomainValidator``` will check on conformity of ```DomainSchema```
      * key - Field name correspond to schema field
      * value - Entity which must pass validation
         ```js 
          { name : "Jack" }
        ```
You can register domain-schema field validation using following approaches:
   *  Type defining
       ```js 
        isAdmin: {
            type: Boolean
        }
       ```
   * Build-in validators
   * Custom validators

For more accurate validation you could use several approaches simultaneously

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

### Nested Schema Validation
Be careful when establish relation via schema field on your domain schema
```js
class Product extends Schema {
  __ = { name: 'Product', tablePrefix: '' };
  id = DomainSchema.Int;
  name = {
    type: String,
    searchText: true
  };
  category = {
    type: Category
   };
}
```

 ```js
class Category extends Schema {
  __ = { name: 'Category', tablePrefix: '' };
  id = DomainSchema.Int;
  name = {
    type: String,
    searchText: true,
  };
  products = {
    type: [Product]
  };
}
```
In this case ```domainValidator``` also will check all fields of nested Category
 schema and then Product again.

So object must have the following structure in order to pass validation
```js
{
  id : 1,
  name : 'Iphone X'
  category : {
    id : 1,
    name : 'Phones',
    products : ...
  }
}
```
To prevent check of nested schema use ```blackbox``` attribute
```js
  products = {
    type: [Product],
    blackbox: true
  };
```
Now the following object will pass validation
```js
{
  id : 1,
  name : 'Iphone X'
  category : {
    id : 1,
    name : 'Phones'
  }
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
