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

class User extends SequelizeBaseEntity {
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

class SequelizeUserService extends SequelizeService<User> {
  constructor () {
    super(User)
  }
}

class SequelizeUserController extends GenericControllerService<User, SequelizeUserService> {
  constructor () {
    super(new SequelizeUserService())
  }
}
const controller = new SequelizeUserController()
const sequelizeRouter: Router = Router()

sequelizeRouter.get('/list', controller.getAll)
sequelizeRouter.get('/get/:id', controller.getById)
sequelizeRouter.get('/paginate', controller.getAllPaginated)
sequelizeRouter.get('/all', controller.getAllWithDeleted)
sequelizeRouter.get('/deleted', controller.getAllDeleted)
sequelizeRouter.post('/create', controller.create)
sequelizeRouter.post('/createMany', controller.bulkCreate)
sequelizeRouter.patch('/update/:id', controller.update)
sequelizeRouter.delete('/hide/:id', controller.softDelete)
sequelizeRouter.patch('/restore/:id', controller.restore)
sequelizeRouter.delete('/delete/:id', controller.hardDelete)
sequelizeRouter.delete('/deleteAll', controller.bulkDelete)

export { sequelizeRouter, sequelize }
