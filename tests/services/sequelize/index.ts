import { SequelizeBaseEntity } from '@gnx-utilities/models'
import { DataTypes, Sequelize } from 'sequelize'
import { SequelizeService } from '@gnx-utilities/services'
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

export class Todo extends SequelizeBaseEntity {
  declare id: number
  declare title: string
  declare completed: boolean
  declare userId: UUID
}

User.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
  },
  { sequelize, modelName: 'user' }
)

Todo.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    completed: { type: DataTypes.BOOLEAN },
    userId: { type: DataTypes.UUID },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
  },
  { sequelize, modelName: 'todo' }
)

User.hasMany(Todo, { foreignKey: 'userId' })
Todo.belongsTo(User)

export class SequelizeTodoService extends SequelizeService<Todo> {
  constructor () {
    super(Todo)
  }
}

export class SequelizeUserService extends SequelizeService<User> {
  constructor () {
    super(User)
  }
}
