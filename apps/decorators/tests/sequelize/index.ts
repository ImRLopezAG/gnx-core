import { SequelizeBaseEntity } from '@gnx-utilities/models'
import { DataTypes, Sequelize } from 'sequelize'
import { sequelizeRepository } from '../../src/decorators/sequelize.decorator'

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db/test.sqlite'
})

export class SequelizeUser extends SequelizeBaseEntity {
  declare firstName: string
  declare lastName: string
}

SequelizeUser.init(
  {
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
  },
  { sequelize, modelName: 'person' }
)

@sequelizeRepository({ model: SequelizeUser })
export class SequelizeUserService {
  greeting (): string {
    return 'Hello, world!'
  }
}
