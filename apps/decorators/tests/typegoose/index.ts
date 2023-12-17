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
