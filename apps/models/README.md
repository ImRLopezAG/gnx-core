# 📝 Generics Models

Generic services is a library that allows you to create services with a generic repository, this library is based on the [Sequelizer](https://sequelize.org/) library and also in [Typegoose](https://typegoose.github.io/typegoose/).

## 📦 Installation

```bash
npm install @gnx-utilities/core@latest
pnpm add @gnx-utilities/core@latest
yarn add @gnx-utilities/core@latest
bun install @gnx-utilities/core@latest
```

## 📖 Usage

### Sequelize

```typescript
import { Sequelize, Model } from 'sequelize';
import { SequelizeService } from '@gnx-utilities/core';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
});

class User extends Model {
  declare firstName: string;
  declare lastName: string;
}

User.init(
  {
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
  },
  { sequelize, modelName: 'user' },
);

class UserService extends SequelizeService<User> {
  constructor() {
    super(User);
  }
}
const userService = new UserService()

const user = await userService.create({ firstName: 'John', lastName: 'Doe' });

console.log(user.firstName); // John
```

### Typegoose

```typescript
import { TypegooseService } from '@gnx-utilities/core';
import { prop, getModelForClass } from '@typegoose/typegoose';

class User {
  @prop()
  firstName: string;

  @prop()
  lastName: string;
}

const UserModel = getModelForClass(User);

class UserService extends TypegooseService<User> {
  constructor(){
    super(UserModel)
  }
}

const userService = new UserService();

const user = await userService.create({ firstName: 'John', lastName: 'Doe' });

console.log(user.firstName); // John
```

### Override methods

```typescript
import { SequelizeService } from '@gnx-utilities/core';
import { ServiceParams, ServiceParamsWithEntity, ServiceParamsWithId } from '@gnx-utilities/core/models/types';

class UserService extends SequelizeService<User> {
  constructor() {
    super(User);
  }
  override async create({ entity }: ServiceParamsWithEntity<User>) {
    // your code here
    return super.create({ entity });
  }

  override async update({ id, entity }: ServiceParams) {
    // your code here
    return super.update({ id, entity });
  }

  override async delete({ id }: ServiceParamsWithId) {
    // your code here
    return super.delete({ id });
  }
}
```

```typescript
import { TypegooseService } from '@gnx-utilities/core';
import { ServiceParams, ServiceParamsWithEntity, ServiceParamsWithId } from '@gnx-utilities/core/models/types';

export class UserService extends TypegooseService<User> {
  constructor() {
    super(UserModel);
  }
  override async create({ entity }: ServiceParamsWithEntity) {
    // your code here
    return super.create({ entity });
  }

  override async update({ id, entity }: ServiceParams) {
    // your code here
    return super.update({ id, entity });
  }

  override async delete({ id }: ServiceParamsWithId) {
    // your code here
    return super.delete({ id });
  }
}
```


## 📚 Documentation

#### Methods

| Method | Description |
| --- | --- |
| `create({ entity })` | Create a new entity  and return it |
| `getAll()` | Get all entities |
| `getById({ id })` | Get an entity by id |
| `update({ id, entity })` | Update an entity by id |
| `delete({ id })` | Delete an entity by id |

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
