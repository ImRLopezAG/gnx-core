---
title: Decorators
description: GNX is a collect of utilities that are used across all of our projects. It is a collection of utilities that we have found useful in our projects and we hope you will find them useful in yours. We have tried to make them as generic as possible so that they can be used in any project.
---

# 📝 Generics Decorators

Generic decorators is a extended library from `@gnx-utilities/core`
that allows you to create services with a generic repository, this library is based on the [Sequelizer](https://sequelize.org/) library and also in [Typegoose](https://typegoose.github.io/typegoose/) but based on typescript decorators.

## 📦 Installation

:::note

You need to install your `ODM`/`ORM` library, for example: `@typegoose/typegoose` or `sequelize` to use this library.

```sh
npm install @gnx-utilities/decorators @gnx-utilities/models
```

```sh
pnpm add @gnx-utilities/decorators @gnx-utilities/models
```

```sh
yarn add @gnx-utilities/decorators @gnx-utilities/models
```

```sh
bun add @gnx-utilities/decorators @gnx-utilities/models
```

:::

## 📖 Usage

:::tip[Recommendation]
Use the `getRepository` function to get the repository instance instead of using the `new` operator.
this for typing reasons. but if you want to use the `new` operator you can do it without any problem.
but you will not have the typing of the repository methods such as `create`, `update`, `delete`, etc.
:::

### 🔷 Sequelize

```typescript
import { SequelizeBaseEntity } from '@gnx-utilities/models'
import { DataTypes, Sequelize } from 'sequelize'
import { sequelizeRepository, getRepository } from '@gnx-utilities/decorators'

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:'
})

export class SequelizeUser extends SequelizeBaseEntity {
  declare firstName: string
  declare lastName: string
}

SequelizeUser.init(
  {
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING }
  },
  { sequelize, modelName: 'person' }
)

@sequelizeRepository({ model: SequelizeUser })
export class SequelizeUserService {
  greeting(): string {
    return 'Hello, world!'
  }
}

const userService = getRepository<SequelizeUser, SequelizeUserService>({
  repository: SequelizeUserService
})

const user = await userService.create({
  entity: { firstName: 'John', lastName: 'Doe' }
})

console.log(user.firstName) // John
```

### 🍃 Typegoose

:::caution
Typegoose needs some configuration to work properly, fallow the example below and your `mongoose` must be configured.
:::
:::tip[Important]
On `prop` decorator, you need to add the `type` property to the decorator, this is because the `@typegoose/typegoose` library needs to know the type of the property.
:::

```ts
import { getModelForClass, prop } from '@typegoose/typegoose'
import { TypegooseBaseEntity } from '@gnx-utilities/models'
import { typegooseRepository } from '../../src/decorators/typegoose.decorator.js'

export class TypegooseUser extends TypegooseBaseEntity {
  @prop({ type: String })
  declare firstName: string

  @prop({ type: String })
  declare lastName: string
}

export const UserModel = getModelForClass(TypegooseUser)

@typegooseRepository({ model: UserModel })
export class TypegooseUserService {
  greeting(): string {
    return 'Hello, world!'
  }
}

const userService = getRepository<TypegooseUser, TypegooseUserService>({
  repository: TypegooseUserService
})

const user = await userService.create({
  entity: { firstName: 'John', lastName: 'Doe' }
})

console.log(user.firstName) // John
```
