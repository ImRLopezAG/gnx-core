import { TypegooseBaseEntity } from '@gnx-utilities/models'
import { TypegooseService } from '@gnx-utilities/services'
import { getModelForClass, prop } from '@typegoose/typegoose'
import { Router } from 'express'
import { connect } from 'mongoose'
import { GenericControllerService } from '../../src'

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

export class TypegooseUserService extends TypegooseService<User> {
  constructor () {
    super(UserModel)
  }
}

export class TypegooseUserController extends GenericControllerService<User, TypegooseUserService > {
  constructor () {
    super(new TypegooseUserService())
  }
}

const typegooseRouter: Router = Router()

const controller = new TypegooseUserController()

typegooseRouter.get('/list', controller.getAll)
typegooseRouter.get('/get/:id', controller.getById)
typegooseRouter.get('/paginate', controller.getAllPaginated)
typegooseRouter.get('/all', controller.getAllWithDeleted)
typegooseRouter.get('/deleted', controller.getAllDeleted)
typegooseRouter.post('/create', controller.create)
typegooseRouter.post('/createMany', controller.bulkCreate)
typegooseRouter.patch('/update/:id', controller.update)
typegooseRouter.delete('/hide/:id', controller.softDelete)
typegooseRouter.patch('/restore/:id', controller.restore)
typegooseRouter.delete('/delete/:id', controller.hardDelete)
typegooseRouter.delete('/deleteAll', controller.bulkDelete)

export { typegooseRouter, connection }
