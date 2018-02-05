## Domain Schema

[![Twitter Follow](https://img.shields.io/twitter/follow/sysgears.svg?style=social)](https://twitter.com/sysgears)

Domain Schema is a set of packages that let you design your application using Domain Driven Design Principles.
You create your schemas with any fields your application needs.
Then use them as a single source of truth in the application to generate database schemas, forms, GraphQL types, etc.
Domain Schema set of packages try to help you with this task, not stay on your way, by imposing minimal limitations on the shape
of your domain schemas, not the fields and the meaning you can use.

Example Domain Schema using ES6 syntax:
```js
class AuthCertificate extends Schema {
  serial = {
    type: String,
    unique: true
  };
}

class AuthFacebook extends Schema {
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
  __ = { transient: true };
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
  id = DomainSchema.Integer;
  name = String;
  category = Category;
}

class Category extends Schema {
  public id = DomainSchema.Integer;
  name = String;
  products = [Product];
}

const ProductSchema = new DomainSchema(Product);
```

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## License
Copyright © 2017 [SysGears INC]. This source code is licensed under the [MIT] license.

[MIT]: LICENSE
[SysGears INC]: http://sysgears.com
