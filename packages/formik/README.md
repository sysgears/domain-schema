## Domain Schema Auto React Forms with Formik

[![npm version](https://badge.fury.io/js/domain-react-forms.svg)](https://badge.fury.io/js/domain-react-forms) [![Twitter Follow](https://img.shields.io/twitter/follow/sysgears.svg?style=social)](https://twitter.com/sysgears)

## Installation

```bash
yarn add @domain-schema/formik @domain-schema/core @domain-schema/validation
```
or
```bash
npm install @domain-schema/formik @domain-schema/core @domain-schema/validation
```
## Usage 
##### NOTE: The current version works properly for the web platform only. React Native forms support will be added soon. 
### Example
```js
import DomainSchema, { Schema } from '@domain-schema/core';
import DomainReactForms, { FieldTypes } from '@domain-schema/formik';

const userFormSchema = new DomainSchema(
  class User extends Schema {
    __ = { name: 'User' };
    id = DomainSchema.Int;
    username = {
      type: String,
      fieldType: FieldTypes.input,
      inputType: 'text',
      name: 'name',
      label: 'Username',
      defaultValue: 'User',
      required: true,
      validators: [
        value => {
          return value.length > 3 ? undefined : 'Must Be more than 3 characters';
        }
      ]
    };
    email = {
      type: String,
      fieldType: FieldTypes.input,
      inputType: 'email',
      label: 'Email',
      placeholder: 'User email',
      required: true,
      email: true
    };
    profile = {
      type: Profile
    };
    password = {
      type: String,
      fieldType: FieldTypes.input,
      inputType: 'password',
      label: 'Password',
      required: true,
      min: 5
    };
    passwordConfirmation = {
      type: String,
      fieldType: FieldTypes.input,
      inputType: 'password',
      label: 'Password Confirmation',
      matches: 'password'
    };
  }
);
class Profile extends Schema {
  __ = { name: 'Profile' };
  firstName = {
    type: String,
    fieldType: FieldTypes.input,
    label: 'First Name',
    required: {
      value: true,
      msg: 'Required First Name'
    }
  };
  lastName = {
    type: String,
    fieldType: FieldTypes.input,
    label: 'Last Name',
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

const UserForm = userForm.generateForm(
  () => {
    // handle submit
  },
  { className: 'my-form' }
);
```

### Supported field types
  
  * ```input``` with the next supported attributes:
    * name - on default equals field name
    * label
    * placeholder
    * inputType - can be one of the following:
      * text [default]  
      * email
      * password
      * url
      * number
      * datetime
      * date
      * time
      * color
      * search
      * file
      * textarea
    * className
    * disabled
    * onChange
    * onBlur
    * defaultValue
       
  ```js
    email = {
      ...
      fieldType: FieldTypes.input,
      inputType: 'email',
      name: 'userEmail',
      ...
    }
    post = {
      ...
      fieldType: FieldTypes.input,
      placeholder: 'Your post',
      inputType: 'textarea',
      label: 'Post',
      ...
    }
  ```
  * ```checkbox``` with attributes:
    * name
    * label
    * className
    * disabled
    * onChange
    * onBlur
    * defaultValue - false, if not specified

  ```js
    active = {
      ...
      fieldType: FieldTypes.checkbox,
      label: 'Active',
      defaultValue: true
    }
  ```

  * ```select``` with attributes:
    * name
    * label
    * values - options for select, can be specified as an array of strings or an array of objects, where each object has label and value properties
    * className
    * disabled
    * onChange
    * onBlur
    * defaultValue

  ```js
    role = {
      ...
      fieldType: FieldTypes.select,
      label: 'User role',
      values: ['user', 'admin'],
      ...
    }
  ```

  * ```radio``` with attributes:
    * name
    * label
    * values - values for radios, can be specified as an array of strings or an array of objects, where each object has label and value properties
    * className
    * disabled
    * onChange
    * onBlur
    * defaultValue

  ```js
    friend = {
      ...
      fieldType: FieldTypes.select,
      label: 'Very best friend',
      values: ['Gerald', 'Ashley'],
      ...
    }
  ```

  * ```button``` with attributes:
    * label
    * className
    * btnType - 'submit' on default
    * disabled - on default depends on form's validity

  ```js
  btnSave = {
    ...
    fieldType: FieldTypes.button,
    label: 'Save',
    type: 'submit',
    className: 'super-btn',
    ...
  }
  ```
  If we don't need to stylize the button, we can simple specify a ```submitLabel``` in schema ```__``` prop. In this case we do not need to specify the button as a field in schema.
  ```js
    class User extends Schema {
      __ = { name: 'User', submitLabel: 'Save' };
      ...
  ```  

  Each field component except ```button```  has wrapper like that:
  ```html
    <FormGroup>
      <Input />
    </FormGroup>
  ```
  We can define classes for styling Input directly in field object:
  ```js
    email = {
      ...
      fieldType: FieldTypes.input,
      className: 'user-email',
      ...
    }
  ```
  Also we can define classes for FormGroup element in ```fieldAttrs``` prop. It might be very useful for styling element position, etc.
  ```js
      email = {
        ...
        fieldType: FieldTypes.input,
        fieldAttrs: {
          className: 'user-email-wrapper',
          ...
        }
      }
  ```

### Custom attributes

We can define our own attributes, but we need to pass their names in ```attributes``` property, like that:

```js
  btnSave = {
    type: String,
    fieldType: FieldTypes.button,
    label: 'Save',
    className: 'super-btn',
    color: 'primary',
    attributes: ['color']
  };
```
  
### Custom field generation

We can use custom field, defining ```fieldType``` as ```FieldTypes.custom``` 
and specified field component in ```component``` prop. All necessary props can be provided via ```attrs```.
```js
  myField = {
    fieldType: FieldTypes.custom,
    component: MyFieldComponent,
    attrs: {
      // all props that your component need
    }
  }
```

## Validation

### Built-in validators

  * ```required``` - Checks if the value is a non empty value
  ```js
    name = {
      ...
      required: true,
      ...
    }
  ```
  * ```match``` - Checks if the value matches some specific field
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
    // Checks length is type is String...
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
object and passing it to the ``` setValidationMessages ``` function.
In that object the ``keys`` are validator names and values can be either strings or functions, as follows:
- Values are strings:
```js
    DomainReactForms.setValidationMessages({
      required: 'This field is required',
      phoneNumber: 'Error! Not a phone number!'
    });
```
- Values are callback functions:
```js
    DomainReactForms.setValidationMessages({
      required: ({field}) => {
        return `Field '${field}' is required`
      },
      phoneNumber: ({values, field}) => {
        return `Error! '${values[field]}' is not a phone number`
      }
    });
```
Callback functions, in turn, get object with the following properties:
  * ``values``  - the validation object
  * ``field``   - the current field name
  * ``schema``  - the domain schema definition object

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
        required: true,
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
Copyright © 2017 [SysGears INC]. This source code is licensed under the [MIT] license.

[MIT]: LICENSE
[SysGears INC]: http://sysgears.com
