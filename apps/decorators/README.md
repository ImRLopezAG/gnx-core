# 📝 Generics Decorators

Generic decorators is a extended library from @gnx-utilities/core
 that allows you to create services with a generic repository, this library is based on the [Sequelizer](https://sequelize.org/) library and also in [Typegoose](https://typegoose.github.io/typegoose/) but based on typescript decorators.

## 📦 Installation

>[!Note]
>You need to have one of the ORM or ODM to manage the data before. The supported ORMs/ODMs are Sequelize and Typegoose wich needs moongose.

```bash
npm install @gnx-utilities/decorators @gnx-utilities/models
```
```bash
pnpm add @gnx-utilities/decorators @gnx-utilities/models
```
```bash
yarn add @gnx-utilities/decorators @gnx-utilities/models
```
```bash
bun add @gnx-utilities/decorators @gnx-utilities/models
```

## 📖 Usage

### Sequelize

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
  greeting (): string {
    return 'Hello, world!'
  }
}


const userService = getRepository<SequelizeUser, SequelizeUserService>({ repository: SequelizeUserService });

const user = await userService.create({ entity: { firstName: 'John', lastName: 'Doe' } });

console.log(user.firstName); // John
```

### Typegoose

>[!Warning]
>Typegoose needs some configuration to work properly, fallow the example below to configure it.

>[!Important]
>On prop decorator you need to add the type of the property, if you don't do this, the library will not work properly.

```typescript
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
  greeting (): string {
    return 'Hello, world!'
  }
}


const userService = getRepository<TypegooseUser, TypegooseUserService>({ repository: TypegooseUserService });

const user = await userService.create({ entity: { firstName: 'John', lastName: 'Doe' } });

console.log(user.firstName); // John

```
>[!Note]
>You Can fallow the test configuration to get more information about the configuration.


## 📝 Documentation

[![Documentation](https://img.shields.io/badge/Documentation-000000?style=for-the-badge&logo=read-the-docs&logoColor=white)](https://gnx-udocs.vercel.app)

### 🛠️ Tools


[![Typescript](https://img.shields.io/badge/Typescript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?logo=sequelize&logoColor=white)](https://sequelize.org/)
[![Typegoose](https://img.shields.io/badge/Typegoose-3178C6?logo=typescript&logoColor=white)](https://typegoose.github.io/typegoose/)
[![NodeJS](https://img.shields.io/badge/NodeJS-339933?logo=node.js&logoColor=white)](https://nodejs.org/es/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)



## Authors

[![ImRLopezAG](https://img.shields.io/badge/ImRLopezAG-000000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ImRLopezAG)

## 🔗 Links

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://imrlopez.dev)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/angel-gabriel-lopez/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/imr_lopez)
