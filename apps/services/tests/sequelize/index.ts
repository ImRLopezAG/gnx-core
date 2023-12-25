import { SequelizeBaseEntity } from '@gnx-utilities/models'
import { DataTypes, Sequelize } from 'sequelize'
import { SequelizeService } from '../../src/services/sequelize.service'
import type { UUID } from 'node:crypto'

export const sequelize = new Sequelize({
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

export class SequelizeUserService extends SequelizeService<User> {
  constructor () {
    super(User)
  }
}
