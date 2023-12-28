import { typegooseRepository } from '@gnx-utilities/decorators'
import { TypegooseBaseEntity } from '@gnx-utilities/models'
import { getModelForClass, prop } from '@typegoose/typegoose'
import { connect } from 'mongoose'

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

@typegooseRepository({ model: UserModel })
class TypegooseUserService {
  greeting (): string {
    return 'Hello, world!'
  }
}

export { User as TypegooseUser, TypegooseUserService, connection }
