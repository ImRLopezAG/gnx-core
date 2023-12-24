# 📝 Generics Controllers

Generic controllers is a library that allows you to create controllers for your models in a simple way, it is compatible with Sequelize and Typegoose using express as a server. soon it will be compatible with other servers and ORMs/ODMs.

## 📦 Installation

>[!Note]
>You need to have one of the ORM or ODM to manage the data before. The supported ORMs/ODMs are Sequelize and Typegoose wich needs moongose, so you need to install it too if you want the whole experience of the library install it.

```bash
npm install @gnx-utilities/service @gnx-utilities/models @gnx-utilities/controller
```
```bash
pnpm add @gnx-utilities/service @gnx-utilities/models @gnx-utilities/controller
```
```bash
yarn add @gnx-utilities/service @gnx-utilities/models @gnx-utilities/controller
```
```bash
bun add @gnx-utilities/service @gnx-utilities/models @gnx-utilities/controller
```

## 📖 Usage

### 🔷 Sequelize

```ts
import { SequelizeBaseEntity } from '@gnx-utilities/models'
import { SequelizeService } from '@gnx-utilities/services'
import { DataTypes, Sequelize } from 'sequelize'
import { GenericControllerService } from '@gnx-utilities/controllers'
import { Router } from 'express'
import type { UUID } from 'node:crypto'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db/test.sqlite'
})

export class User extends SequelizeBaseEntity {
  declare id: UUID
  declare firstName: string
  declare lastName: string
  declare email: string
}

User.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
  },
  { sequelize, modelName: 'person' }
)

class UserService extends SequelizeService<User> {
  constructor () {
    super(User)
  }
}

class UserController extends GenericControllerService<User, UserService> {
  constructor () {
    super(new UserService())
  }
}
const controller = new UserController()
const router: Router = Router()

router.get('/list', controller.getAll)
router.get('/get/:id', controller.getById)
router.get('/paginate', controller.getAllPaginated)
router.get('/all', controller.getAllWithDeleted)
router.get('/deleted', controller.getAllDeleted)
router.post('/create', controller.create)
router.post('/createMany', controller.bulkCreate)
router.patch('/update/:id', controller.update)
router.delete('/hide/:id', controller.softDelete)
router.patch('/restore/:id', controller.restore)
router.delete('/delete/:id', controller.hardDelete)
router.delete('/deleteAll', controller.bulkDelete)

export { router, sequelize }
```


### 🍃 Typegoose

```ts
import { TypegooseBaseEntity } from '@gnx-utilities/models'
import { TypegooseService } from '@gnx-utilities/services'
import { getModelForClass, prop } from '@typegoose/typegoose'
import { Router } from 'express'
import { connect } from 'mongoose'
import { GenericControllerService } from '@gnx-utilities/controllers'

const uri = 'mongodb://localhost:27017/?readPreference=primary&ssl=false&directConnection=true'

const connection = async (): Promise<void> => {
  await connect(uri, { dbName: 'test' })
}

export class User extends TypegooseBaseEntity {
  @prop({ type: String })
  declare firstName: string

  @prop({ type: String })
  declare lastName: string

  @prop({ type: String })
  declare email: string
}

export const UserModel = getModelForClass(User)

export class UserService extends TypegooseService<User> {
  constructor () {
    super(UserModel)
  }
}

export class UserController extends GenericControllerService<User, UserService > {
  constructor () {
    super(new UserService())
  }
}

const controller = new UserController()

const router: Router = Router()

router.get('/list', controller.getAll)
router.get('/get/:id', controller.getById)
router.get('/paginate', controller.getAllPaginated)
router.get('/all', controller.getAllWithDeleted)
router.get('/deleted', controller.getAllDeleted)
router.post('/create', controller.create)
router.post('/createMany', controller.bulkCreate)
router.patch('/update/:id', controller.update)
router.delete('/hide/:id', controller.softDelete)
router.patch('/restore/:id', controller.restore)
router.delete('/delete/:id', controller.hardDelete)
router.delete('/deleteAll', controller.bulkDelete)

export { router, connection }
```

### Your server

```ts
import express, { json, urlencoded } from 'express'
import type { Application } from 'express'
import { sequelizeRouter, sequelize } from './sequelize'
import { typegooseRouter, connection } from './typegoose'

const app: Application = express()

app.use(json())
app.use(urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello World')
})
app.use('/api/sequelize', sequelizeRouter)
app.use('/api/typegoose', typegooseRouter)

async function handleConnection (): Promise<void> {
  try {
    await Promise.all([
      connection(),
      sequelize.sync({ alter: true })
    ])
  } catch (err) {
    console.error(`Unable to connect to the database: ${err}`)
  }
}

await handleConnection()

const port = 4000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
export { app, handleConnection }
```
### 🛠️ Tools


[![Typescript](https://img.shields.io/badge/Typescript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?logo=sequelize&logoColor=white)](https://sequelize.org/)
[![Typegoose](https://img.shields.io/badge/Typegoose-3178C6?logo=typescript&logoColor=white)](https://typegoose.github.io/typegoose/)
[![NodeJS](https://img.shields.io/badge/NodeJS-339933?logo=node.js&logoColor=white)](https://nodejs.org/es/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## 📝 Documentation

[![Documentation](https://img.shields.io/badge/Documentation-000000?style=for-the-badge&logo=read-the-docs&logoColor=white)](https://gnx-udocs.vercel.app)

## Authors

[![ImRLopezAG](https://img.shields.io/badge/ImRLopezAG-000000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ImRLopezAG)

## 🔗 Links

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://imrlopez.dev)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/angel-gabriel-lopez/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/imr_lopez)
