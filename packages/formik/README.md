# Domain Schema React Forms with Formik

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

#### Simple form

```js
import DomainSchema, { Schema } from '@domain-schema/core';
import { DomainSchemaFormik } from '@domain-schema/formik';

import { Button, Form, RenderField, RenderCheckBox, RenderSelect } from '../my-components';

const userFormSchema =
  class User extends Schema {
    __ = { name: 'User' };
    username = {
      type: String,
      input: {
        label: 'Username'
      }
    };
    email = {
      type: String,
      input: {
        type: 'email',
        label: 'Email'
      },
      email: true
    };
    password = {
      type: String,
      input: {
        type: 'password',
        label: 'Password',
      },
      min: 5
    };
    passwordConfirmation = {
      type: String,
      input: {
        type: 'password',
        label: 'Password Confirmation',
      },
      matches: 'password'
    };
    setSubmitBtn() {
      return {
        label: 'Submit'
      }
    }
  }

// set components globally for all forms
DomainSchemaFormik.setFormComponents({
  input: RenderField,
  select: RenderSelect,
  checkbox: RenderCheckBox,
  form: Form,
  button: Button
});

const userForm =  new DomainSchemaFormik(userFormSchema);

const UserForm = userForm.generateForm();

<UserForm onSubmit={values => {
    // handle submit
  }}>
```

#### Complex form

```js
import DomainSchema, { Schema } from '@domain-schema/core';
import { DomainSchemaFormik, FieldTypes, FormSchema } from '@domain-schema/formik';

import { Button, Form, RenderField, RenderCheckBox, RenderSelect } from '../my-components';

const userFormSchema =
  class User extends Schema {
    __ = { name: 'User' };
    username = {
      type: String,
      input: {
        label: 'Username'
      },
      defaultValue: 'User',
      validators: [
        value => {
          return value.length > 3 ? undefined : 'Must Be more than 3 characters';
        }
      ]
    };
    email = {
      type: String,
      input: {
        type: 'email',
        label: 'Email',
        placeholder: 'User email'
      },
      email: true
    };
    profile = {
      type: Profile
    };
    password = {
      type: String,
      input: {
        type: 'password',
        label: 'Password',
      },
      min: 5
    };
    passwordConfirmation = {
      type: String,
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

class Profile extends Schema {
  __ = { name: 'Profile' };
  firstName = {
    type: String,
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
    input: {
      label: 'Last Name'
    },
    optional: true
  };
};

const userForm =  new DomainSchemaFormik(userFormSchema);

// set components for particular DomainSchemaFormik instance
userForm.setFormComponents({
  input: RenderField,
  select: RenderSelect,
  checkbox: RenderCheckBox,
  form: Form,
  button: Button
});

// change error messages
DomainSchemaFormik.setValidationMessages({
  required: ({fieldName}) => {
    return `Field '${fieldName}' is required`
  }
});

const UserForm = userForm.generateForm({ className: 'my-form' });

// Defining onSubmit prop is required
<UserForm onSubmit={(values, formikBag) => {
    // handle submit
  }}>
```

### Using different field types

All fields can take 3 special attributes: ```onChange```, ```onBlur``` and ```type```. All other defined attributes will be directly passed to the field component. Attribute ```name``` will be define automatically and equals field name from schema. ```input``` is default field type and it can be omitted.

* ```input```

  ```js
    email = {
      ...
      fieldType: 'input',
      input: {
        type: 'email',
        placeholder: 'User Email'
      }
      ...
    }
    post = {
      ...
      // fieldType: 'input'
      input: {
        placeholder: 'Your post',
        type: 'textarea',
        label: 'Post'
      }
      ...
    }
  ```

* ```checkbox```

  ```js
    active = {
      ...
      fieldType: 'checkbox',
      input: {
        label: 'Active'
      },
      defaultValue: true
    }
  ```

* ```select```

  ```js
    role = {
      ...
      fieldType: 'select',
      input: {
        label: 'User role',
        values: ['user', 'admin']
      }
      ...
    }
  ```

* ```radio```

  ```js
    friend = {
      ...
      fieldType: 'radio',
      input: {
        label: 'Very best friend',
        values: ['Gerald', 'Ashley']
      },
      ...
    }
  ```

### Buttons

To create a ```submit``` button in the form we need to pass object with attributes to the  ```generateForm``` method.
All attributes, that we define in the object will be passed to the button:

```js
  ...
  userForm.generateForm({
    label: 'Submit',
    className: 'submit-btn',
    color: 'primary'
  })
```

In some cases, the submit button is not enough for us. We should pass object that has ```submit``` and ```reset``` propperties. ```Reset``` button resets the form-data to its initial values.

```js
  userForm.generateForm({
    submit: {
      label: 'Submit',
      className: 'submit-btn'
    },
    reset: {
      label: 'Reset',
      className: 'reset-btn'
    }
  })
```

For position styling buttons have the `align` property which can take on values ```left``` or ```right```. By default, value is ```center```.

```js
  userForm.generateForm({
    ...
    align: 'left'
  })
```

Buttons are wrapped in a div with style ```display: flex```, so that any properties for flex items can be applied to them. For example, the order of the buttons can be changed using ```order```.

```css
  ...
  .submit-btn {
    order: 1
  }
  .reset-btn {
    order: 0
  }
  ...
```

```js
  userForm.generateForm({
    submit: {
      ...
      className: 'submit-btn'
    },
    reset: {
      ...
      className: 'reset-btn'
    }
  })
```

### Set form components

Form components can be set in two ways. Globally, for all forms:

```js
...
DomainSchemaFormik.setFormComponents({
  input: RenderField,
  select: RenderSelect,
  checkbox: RenderCheckBox,
  form: Form,
  button: Button
});
...
```

And locally, for particular DomainSchemaFormik instance:

```js
...
const userForm =  new DomainSchemaFormik(userFormSchema);

userForm.setFormComponents({
  input: RenderField,
  select: RenderSelect,
  checkbox: RenderCheckBox,
  form: Form,
  button: Button
});
...
```

### Form submitting

We should define ```onSubmit``` callback which is received values from form fields as ```values``` and helper methods as ```formikBag```. More about these methods in official docs [FormikBag].

```js
<UserForm onSubmit={(values, formikBag) => {
    // handle submit
  }}>
```

### Generate form fields without form

If we need maximum flexibility, we can generate only fields without the form itself. For that we should use ```generateFields``` method instead of ```generateForm```. But note, that you should use Formik manually when you generating fields without form.

```js
const fieldSet = userForm.generateFields();
...
return <form>{fieldSet}</form>;
```

### Custom field generation

We can use custom field, defining ```fieldType``` as ```custom```
and specified field component in ```component``` prop. All necessary props can be provided via ```input```.

```js
  myField = {
    fieldType: 'custom',
    component: MyFieldComponent,
    input: {
      // all props that our component may need
    }
  }
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
    DomainSchemaFormik.setValidationMessages({
      required: 'This field is required',
      phoneNumber: 'Error! Not a phone number!'
    });
```

* Values are callback functions:

```js
    DomainSchemaFormik.setValidationMessages({
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

Copyright © 2017-2018 [SysGears INC]. This source code is licensed under the [MIT] license.

[MIT]: LICENSE
[SysGears INC]: http://sysgears.com
[FormikBag]: https://github.com/jaredpalmer/formik#the-formikbag
