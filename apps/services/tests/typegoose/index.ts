import { getModelForClass, prop } from '@typegoose/typegoose'
import { TypegooseBaseEntity } from '@gnx-utilities/models'
import { TypegooseService } from '../../src/services/typegoose.service.js'

export class User extends TypegooseBaseEntity {
  @prop({ type: String })
  declare firstName: string

  @prop({ type: String })
  declare lastName: string
}

export const UserModel = getModelForClass(User)

export class TypegooseUserService extends TypegooseService<User> {
  constructor () {
    super(UserModel)
  }
}
