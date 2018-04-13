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
import DomainReactForms, { FieldTypes, FormSchema } from '@domain-schema/formik';

const userFormSchema = new DomainSchema(
  class User extends FormSchema {
    __ = { name: 'User' };
    id = DomainSchema.Int;
    username = {
      type: String,
      fieldType: FieldTypes.input,
      input: {
        type: 'text',
        name: 'name',
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
    email = {
      type: String,
      fieldType: FieldTypes.input,
      input: {
        inputType: 'email',
        label: 'Email',
        placeholder: 'User email'
      },
      required: true,
      email: true
    };
    profile = {
      type: Profile
    };
    password = {
      type: String,
      fieldType: FieldTypes.input,
      input: {
        inputType: 'password',
        label: 'Password',
      },
      required: true,
      min: 5
    };
    passwordConfirmation = {
      type: String,
      fieldType: FieldTypes.input,
      input: {
        type: 'password',
        label: 'Password Confirmation',
      },
      matches: 'password'
    };
    setSubmitBtn() {
      return {
        label: 'Submit',
        className: 'submit-btn'
      }
    }
  }
);
class Profile extends Schema {
  __ = { name: 'Profile' };
  firstName = {
    type: String,
    fieldType: FieldTypes.input,
    input: {
      label: 'First Name'
    },
    required: {
      value: true,
      msg: 'Required First Name'
    }
  };
  lastName = {
    type: String,
    fieldType: FieldTypes.input,
    input: {
      label: 'Last Name'
    },
    required: true
  };
};

const userForm =  new DomainReactForms(userFormSchema);

// change error messages
DomainReactForms.setValidationMessages({
  required: ({fieldName}) => {
    return `Field '${fieldName}' is required`
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
  
  * ```input``` with the next supported types:
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
       
  ```js
    email = {
      ...
      fieldType: FieldTypes.input,
      input: {
        type: 'email',
        name: 'userEmail'
      }
      ...
    }
    post = {
      ...
      fieldType: FieldTypes.input,
      input: {
        placeholder: 'Your post',
        type: 'textarea',
        label: 'Post'
      }
      ...
    }
  ```
  * ```checkbox```
    * defaultValue - false, if not specified

  ```js
    active = {
      ...
      fieldType: FieldTypes.checkbox,
      input: {
        label: 'Active'
      },
      defaultValue: true
    }
  ```

  * ```select```
    * values - options for select, can be specified as an array of strings or an array of objects, where each object has label and value properties

  ```js
    role = {
      ...
      fieldType: FieldTypes.select,
      input: {
        label: 'User role',
        values: ['user', 'admin']
      }
      ...
    }
  ```

  * ```radio``` 
    * values - values for radios, can be specified as an array of strings or an array of objects, where each object has label and value properties

  ```js
    friend = {
      ...
      fieldType: FieldTypes.select,
      input: {
        label: 'Very best friend',
        values: ['Gerald', 'Ashley']
      },
      ...
    }
  ``` 

  Each field component has wrapper like that:
  ```html
    <FormGroup>
      <Input />
    </FormGroup>
  ```
  We can define classes for styling Input directly in className prop:
  ```js
    email = {
      ...
      fieldType: FieldTypes.input,
      input: {
        className: 'user-email'
      },
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

### Buttons

To create a ```submit``` button in the form we need to use special method ```setSubmitButtons``` in schema with will return object with props for button.
In most cases, we'll specify a label and classes for styling, but we can also pass any other attributes for button.
```js
  setSubmitBtn() {
    return {
      label: 'Submit',
      className: 'submit-btn',
      color: 'primary'
    }
  }
```
In some cases, the submit button is not enough for us. We can also define ```reset``` button similarly.
```js
  setResetBtn() {
    return {
      label: 'Reset',
      className: 'reset-btn'
    }
  }
```
The buttons have a div container attributes that can be passed with the ```setBtnsWrapperProps``` function.
```js
  setBtnsWrapperProps() {
    return {
      className: 'buttons-wrapper'
    };
  };
```

We use the awesome [Reactstrap library](https://reactstrap.github.io/) at the core for our UI components.
  
### Custom field generation

We can use custom field, defining ```fieldType``` as ```FieldTypes.custom``` 
and specified field component in ```component``` prop. All necessary props can be provided via ```input```.
```js
  myField = {
    fieldType: FieldTypes.custom,
    component: MyFieldComponent,
    input: {
      // all props that our component may need
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
      required: ({fieldName}) => {
        return `Field '${fieldName}' is required`
      },
      phoneNumber: ({values, fieldName}) => {
        return `Error! '${values[fieldName]}' is not a phone number`
      }
    });
```
Callback functions, in turn, get object with the following properties:
  * ``values``  - the validation object
  * ``fieldName``   - the current field name
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
