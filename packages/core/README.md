## Domain Schema

[![npm version](https://badge.fury.io/js/domain-schema.svg)](https://badge.fury.io/js/domain-schema) [![Twitter Follow](https://img.shields.io/twitter/follow/sysgears.svg?style=social)](https://twitter.com/sysgears)

Domain Schema is a set of packages that let you design your application using Domain Driven Design Principles.
You create your schemas with any fields your application needs.
Then use them as a single source of truth in the application to generate database schemas, forms, GraphQL types, etc.
Domain Schema set of packages try to help you with this task, not stay on your way, by imposing minimal limitations on the shape
of your domain schemas, not the fields and the meaning you can use.

Example Domain Schema using ES6 syntax:
```js
class AuthCertificate extends Schema {
  __ = { name: 'AuthCertificate' };
  serial = {
    type: String,
    unique: true
  };
}

class AuthFacebook extends Schema {
  __ = { name: 'AuthFacebook' };
  fbId = {
    type: String,
    unique: true
  };
  displayName = {
    type: String,
    optional: true
  };
}

class UserProfile extends Schema {
  __ = { name: 'UserProfile' };
  firstName = {
    type: String,
    optional: true
  };
  lastName = {
    type: String,
    optional: true
  };
  fullName = {
    type: String,
    optional: true,
    transient: true
  };
  notes = [String];
}

class UserAuth extends Schema {
  __ = { name: 'UserAuth', transient: true };
  certificate = {
    type: AuthCertificate,
    optional: true
  };
  facebook = {
    type: AuthFacebook,
    optional: true
  };
}

export const User = new DomainSchema(
  class User extends Schema {
    __ = { name: 'User' };
    id = DomainSchema.Integer;
    username = {
      type: String,
      unique: true
    };
    email = {
      type: String,
      unique: true
    };
    password = {
      type: String,
      private: true
    };
    role = {
      type: String,
      default: 'user'
    };
    isActive = {
      type: Boolean,
      default: false,
      optional: true
    };
    auth = {
      type: [UserAuth],
      optional: true
    };
    profile = {
      type: [UserProfile],
      optional: true
    };
  }
);
```

Example cyclic Domain Schema definition
```js
class Product extends Schema {
  __ = { name: 'Product' };
  id = DomainSchema.Integer;
  name = String;
  category = Category;
}

class Category extends Schema {
  __ = { name: 'Category' };
  public id = DomainSchema.Integer;
  name = String;
  products = [Product];
}

const ProductSchema = new DomainSchema(Product);
```
Such cyclic dependencies must be contained in one file.

## Installation

```bash
npm install -g domain-schema
```

## License
Copyright © 2017 [SysGears INC]. This source code is licensed under the [MIT] license.

[MIT]: LICENSE
[SysGears INC]: http://sysgears.com
