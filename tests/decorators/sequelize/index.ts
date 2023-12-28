import { SequelizeBaseEntity } from '@gnx-utilities/models'
import { DataTypes, Sequelize } from 'sequelize'
import { sequelizeRepository } from '@gnx-utilities/decorators'
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

@sequelizeRepository({ model: User })
class SequelizeUserService {
  greeting (): string {
    return 'Hello, world!'
  }
}

export { SequelizeUserService, User as SequelizeUser, sequelize }
