import { SequelizeBaseEntity } from '@gnx-utilities/models'
import { DataTypes, Sequelize } from 'sequelize'
import { SequelizeService } from '../../src/services/sequelize.service.js'

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db/test.sqlite'
})
export class User extends SequelizeBaseEntity {
  declare firstName: string
  declare lastName: string
}

User.init(
  {
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
  },
  { sequelize, modelName: 'person' }
)

export class SequelizeUserService extends SequelizeService<User> {
  constructor () {
    super(User)
  }
}
