import { getModelForClass, prop } from '@typegoose/typegoose'
import { TypegooseBaseEntity } from '@gnx-utilities/models'
import { TypegooseService } from '../../src/services/typegoose.service'
import { connect } from 'mongoose'

const uri = 'mongodb://localhost:27017/?readPreference=primary&ssl=false&directConnection=true'

const connection = async (): Promise<void> => {
  await connect(uri, { dbName: 'test' })
}
class User extends TypegooseBaseEntity {
  @prop({ type: String })
  declare firstName: string

  @prop({ type: String })
  declare lastName: string

  @prop({ type: String })
  declare email: string
}

const UserModel = getModelForClass(User)

class TypegooseUserService extends TypegooseService<User> {
  constructor () {
    super(UserModel)
  }
}

export { TypegooseUserService, connection }
