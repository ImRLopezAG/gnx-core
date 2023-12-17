---
title: Services
description: GNX is a collect of utilities that are used across all of our projects. It is a collection of utilities that we have found useful in our projects and we hope you will find them useful in yours. We have tried to make them as generic as possible so that they can be used in any project.
---

# 📝 Generics Services

Generic services is a library that allows you to create services with a generic repository, this library is based on the [Sequelizer](https://sequelize.org/) library and also in [Typegoose](https://typegoose.github.io/typegoose/).

## 📦 Installation

:::note

You need to install your `ODM`/`ORM` library, for example: `@typegoose/typegoose` or `sequelize` to use this library.

```sh
npm install @gnx-utilities/core @gnx-utilities/models
```

```sh
pnpm add @gnx-utilities/core @gnx-utilities/models
```

```sh
yarn add @gnx-utilities/core @gnx-utilities/models
```

```sh
bun add @gnx-utilities/core @gnx-utilities/models
```

:::

## 📖 Usage

### 🔷 Sequelize

```typescript
import { SequelizeBaseEntity } from '@gnx-utilities/models'
import { DataTypes, Sequelize } from 'sequelize'
import { SequelizeService } from '@gnx-utilities/core'

export const sequelize = new Sequelize('test', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres'
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

export class UserService extends SequelizeService<User> {
  constructor() {
    super(User)
  }
}

const userService = new UserService()

const user = await userService.create({
  entity: { firstName: 'John', lastName: 'Doe' }
})

console.log(user.firstName) // John
```

### 🍃 Typegoose

:::caution
Typegoose needs some configuration to work properly, fallow the example below to configure it.
:::
:::tip[Important]
On `prop` decorator, you need to add the `type` property to the decorator, this is because the `@typegoose/typegoose` library needs to know the type of the property.
:::

```typescript
import { TypegooseService } from '@gnx-utilities/core'
import { getModelForClass, prop } from '@typegoose/typegoose'
import { TypegooseBaseEntity } from '@gnx-utilities/models'

export class User extends TypegooseBaseEntity {
  @prop({ type: String })
  declare firstName: string

  @prop({ type: String })
  declare lastName: string
}

export const UserModel = getModelForClass(User)

export class UserService extends TypegooseService<User> {
  constructor() {
    super(UserModel)
  }
}

const userService = new UserService()

const user = await userService.create({
  entity: { firstName: 'John', lastName: 'Doe' }
})

console.log(user.firstName) // John
```

## ✏️ Override methods - Sequelize

:::tip[Important]
You need to use the `override` keyword to override the methods.
:::

:::caution
When you override a method, you need to call the super method or return the value that the super method returns.
:::

```ts
import { SequelizeService } from '@gnx-utilities/core'
import {
  ServiceParams,
  ServiceParamsWithEntity,
  ServiceParamsWithId
} from '@gnx-utilities/models'

export class UserService extends SequelizeService {
  constructor() {
    super(User)
  }
  override async create({ entity }: ServiceParamsWithEntity) {
    // your code here
    return super.create({ entity })
  }

  override async update({ id, entity }: ServiceParams) {
    // your code here
    return super.update({ id, entity })
  }

  override async delete({ id }: ServiceParamsWithId) {
    // your code here
    return super.delete({ id })
  }
}
```

## ✏️ Override methods - Typegoose

```ts
import { TypegooseService } from '@gnx-utilities/core'
import {
  ServiceParams,
  ServiceParamsWithEntity,
  ServiceParamsWithId
} from '@gnx-utilities/models'

export class UserService extends TypegooseService {
  constructor() {
    super(UserModel)
  }
  override async create({ entity }: ServiceParamsWithEntity<User>) {
    // your code here
    return super.create({ entity })
  }

  override async update({ id, entity }: ServiceParams) {
    // your code here
    return super.update({ id, entity })
  }

  override async delete({ id }: ServiceParamsWithId) {
    // your code here
    return super.delete({ id })
  }
}
```
