---
title: Services
description: Get started building fastest services with GNX
---
Services Api contain the Generics repository of our `ODM`/`ORM` based on our models API
`gnx-utilities/models` it has many methods which will help you to implement your applications quickly

## ✏️ Methods

| Method | Params | Return |
| --- | --- | --- |
| getAll | - | Promise<T[]> |
| getAllPaginated | { page, limit } | Promise<Pagination<T>> |
| getAllDeleted | - | Promise<T[]> |
| getAllWithDeleted | - | Promise<T[]> |
| getById | { id } | Promise<T> |
| create | { entity } | Promise<T> |
| update | { entity, id } | Promise<T> |
| hardDelete | { id } | Promise<void> |
| softDelete | { id } | Promise<boolean> |
| restore | { id } | Promise<boolean> |
| getSchema | - | Schema[] |

## 📝 Declaration 
### 🔷 Sequelize

This is an example of how to declare a service with the `SequelizeService` class and the `SequelizeBaseEntity` class from `gnx-utilities/models` library.

```ts
import { SequelizeBaseEntity } from '@gnx-utilities/models';
import { DataTypes, Sequelize } from 'sequelize';
import { SequelizeService } from '@gnx-utilities/core';

export const sequelize = new Sequelize('test', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres',
});

export class User extends SequelizeBaseEntity {
  declare firstName: string;
  declare lastName: string;
}

User.init(
  {
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
  },
  { sequelize, modelName: 'person' }
);

export class UserService extends SequelizeService<User> {
  constructor() {
    super(User);
  }
}

const userService = new UserService();
```

### 🍃 Typegoose

Declaration with `TypegooseService` class and the `TypegooseBaseEntity` class from `gnx-utilities/models` library.

:::caution
Typegoose needs some configuration to work properly, fallow the example below to configure it.
:::
:::tip[Important]
On `prop` decorator, you need to add the `type` property to the decorator, this is because the `@typegoose/typegoose` library needs to know the type of the property.
:::

```ts
import { TypegooseService } from '@gnx-utilities/core';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { TypegooseBaseEntity } from '@gnx-utilities/models';

export class User extends TypegooseBaseEntity {
  @prop({ type: String })
  declare firstName: string;

  @prop({ type: String })
  declare lastName: string;
}

export const UserModel = getModelForClass(User);

export class UserService extends TypegooseService<User> {
  constructor() {
    super(UserModel);
  }
}

const userService = new UserService();

```

### getAll

Get all documents from a collection

```ts
const users = await userService.getAll();

console.log(users); // [ { firstName: 'John', lastName: 'Doe' } ]
```

### getAllPaginated

Get all documents from a collection with pagination

```ts
const users = await userService.getAllPaginated({ page: 1, limit: 10 });

console.log(users); // { docs: [ { firstName: 'John', lastName: 'Doe' } ], totalDocs: 1, limit: 10, totalPages: 1, page: 1, pagingCounter: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null }
```

### getAllDeleted

Get all deleted documents from a collection

```ts

const users = await userService.getAllDeleted();

console.log(users); // [ { firstName: 'John', lastName: 'Doe' } ]
```

### getAllWithDeleted

Get all documents from a collection with deleted documents

```ts

const users = await userService.getAllWithDeleted();

console.log(users); // [ { firstName: 'John', lastName: 'Doe' } ]
```

### getById

Get a document by id

```ts

const user = await userService.getById({ id: 1 });

console.log(user); // { firstName: 'John', lastName: 'Doe' }
```

### create

Create a document

```ts

const user = await userService.create({
  entity: { firstName: 'John', lastName: 'Doe' },
});

console.log(user.firstName); // John
```

### update

Update a document

```ts

const user = await userService.update({
  id: 1,
  entity: { firstName: 'Jane', lastName: 'Doe' },
});

console.log(user.firstName); // Jane
```

### hardDelete

Hard delete a document

```ts

await userService.hardDelete({ id: 1 });
```
on the database the document will be deleted


### softDelete

Soft delete a document

```ts
await userService.softDelete({ id: 1 });
```
on the database the document will be updated with the isDeleted field

| id | firstName | lastName | createdAt | updatedAt | isDeleted |
| --- | --- | --- | --- | --- | --- |
| 1 | John | Doe | 2021-01-01 00:00:00 | 2021-01-01 00:00:00 | 1 or true |

### restore

Restore a document

```ts
await userService.restore({ id: 1 });
```
on the database the document will be updated with the isDeleted field

| id | firstName | lastName | createdAt | updatedAt | isDeleted |
| --- | --- | --- | --- | --- | --- |
| 1 | John | Doe | 2021-01-01 00:00:00 | 2021-01-01 00:00:00 | 0 or false |

### getSchema

Get the schema of the model

```ts

const schema = userService.getSchema();

console.log(schema); // [ { name: 'firstName', type: 'string' }, { name: 'lastName', type: 'string' } ]
```

