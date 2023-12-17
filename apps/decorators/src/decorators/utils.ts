import type { GenericService, SequelizeBaseEntity, TypegooseBaseEntity } from '@gnx-utilities/models'

interface Builder<T> {
  repository: new () => T
}

type EntityRepository<T extends SequelizeBaseEntity | TypegooseBaseEntity> = GenericService<T> & {
  model: T
}
/**
 * Retrieves a generic service instance based on the provided repository.
 * @param repository - The repository to build the service from.
 * @returns A generic service instance that extends the provided entity type and additional functionality defined by U.
 * @template T - The entity type that the service operates on, extending either SequelizeBaseEntity or TypegooseBaseEntity.
 * @template U - Additional functionality that the service should have, defined by a builder object.
 * @example
 * import { SequelizeBaseEntity } from '@gnx-utilities/models'
 * import { DataTypes, Sequelize } from 'sequelize'
 * import { SequelizeRepository } from '@gnx-utilities/decorators'
 *
 * export const sequelize = new Sequelize('test', 'postgres', 'root', {
 *   host: 'localhost',
 *   dialect: 'postgres'
 * })
 * export class User extends SequelizeBaseEntity {
 *   declare firstName: string
 *   declare lastName: string
 * }
 *
 * User.init(
 *   {
 *     firstName: { type: DataTypes.STRING },
 *     lastName: { type: DataTypes.STRING }
 *   },
 *   { sequelize, modelName: 'person' }
 * )
 *
 * .@SequelizeRepository({ model: User, sequelize  })
 * export class UserService {
 * }
 *
 * const userService = getRepository<User, UserService>({ repository: UserService })
 *
 * const users = await userService.getAll()
 * console.log(users) // [ { id: 1, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, updatedAt: 2020-10-30T12:00:00.000Z } ]
 */
function getRepository<T extends SequelizeBaseEntity | TypegooseBaseEntity, U = Record<string, any> > ({ repository }: Builder<U>): EntityRepository<T> & U {
  const properties = Object.getOwnPropertyNames(repository.prototype)
  // eslint-disable-next-line new-cap
  const repositoryInstance = new repository()
  return properties
    .filter((name) => name !== 'constructor')
    .reduce((acc, name) => {
      const method = repositoryInstance[name]
      if (method) {
        acc[name] = method
      } else {
        acc[name] = repository.prototype[name]
      }
      return acc
    }, {}) as EntityRepository<T> & U
}

export { getRepository }
