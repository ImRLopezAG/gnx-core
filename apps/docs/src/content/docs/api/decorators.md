---
title: Decorators
description: Get started building fastest services with GNX
---
The decorators API contain the Generics repository of our `ODM`/`ORM` based on our models API `gnx-utilities/models` it has many methods which will help you to implement your applications quickly as our packages `gnx-utilities/service`, `gnx-utilities/decorators` is an abstraction of the `gnx-utilities/service` package.

## ✏️ Methods

| Method | Params | Return |
| --- | --- | --- |
| model | - | `EntityModel` |
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
import { SequelizeBaseEntity } from '@gnx-utilities/models'
import { DataTypes, Sequelize } from 'sequelize'
import { sequelizeRepository, getRepository } from '@gnx-utilities/decorators'

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:'
})

export class User extends SequelizeBaseEntity {
  declare firstName: string
  declare lastName: string
}

User.init(
  {
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING }
  },
  { sequelize, modelName: 'person' }
)

@sequelizeRepository({ model: User })
export class UserService {
  greeting (): string {
    return 'Hello, world!'
  }
}

const userService = getRepository<User, UserService>({repository: UserService})
```

### 🍃 Typegoose

This is an example of how to declare a service with the `TypegooseService` class and the `TypegooseBaseEntity` class from `gnx-utilities/models` library.

```ts
import { TypegooseBaseEntity } from '@gnx-utilities/models'
import { prop } from '@typegoose/typegoose'
import { typegooseRepository, getRepository } from '@gnx-utilities/decorators'

export class User extends TypegooseBaseEntity {
  @prop({ required: true, type: String })
  declare firstName: string

  @prop({ required: true, type: String })
  declare lastName: string
}

@typegooseRepository({ model: User })
export class UserService {
  greeting (): string {
    return 'Hello, world!'
  }
}

const userService = getRepository<User, UserService>({repository: UserService})
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

