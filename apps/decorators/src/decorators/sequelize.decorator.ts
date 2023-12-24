import type { GenericService, Pagination, PaginationType, Schema, SequelizeBaseEntity, ServiceParams, ServiceParamsWithEntity, ServiceParamsWithId, ExcludeFields } from '@gnx-utilities/models'
import { GNXErrorHandler, GNXErrorTypes } from '@gnx-utilities/models'
import type { ModelStatic } from 'sequelize'
import { Op } from 'sequelize'
import type { MakeNullishOptional } from 'sequelize/types/utils'

interface ISequelizeRepository {
  model: ModelStatic<SequelizeBaseEntity>
}

type Repository<T extends SequelizeBaseEntity> = GenericService<T> & {
  model: ModelStatic<SequelizeBaseEntity>
}

type Creation<T extends SequelizeBaseEntity> = MakeNullishOptional<T['_creationAttributes']>

/**
 * Sequelize repository decorator
 * @param {ISequelizeRepository} { model }
 * @returns {ClassDecorator}
 * @memberof SequelizeService
 * @example
 * import { SequelizeBaseEntity } from '@gnx-utilities/models'
 * import { DataTypes, Sequelize } from 'sequelize'
 * import { SequelizeRepository } from '@gnx-utilities/decorators'
 *
 * export const sequelize = new Sequelize({
 *   dialect: 'sqlite',
 *   storage: ':memory:'
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
 * export class SequelizeUserService {
 * }
 *
 * const userService = new SequelizeUserService()
 *
 * const users = await userService.getAll()
 * console.log(users) // [ { id: 1, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, updatedAt: 2020-10-30T12:00:00.000Z } ]
 */
function sequelizeRepository<T extends SequelizeBaseEntity> ({ model }: ISequelizeRepository): ClassDecorator {
  return function (constructor) {
    Object.assign<any, Repository<T>>(constructor.prototype, {
      model,
      /**
       * Get all entities without pagination and deleted
       * @returns {Promise<T[]>}
       * @memberof SequelizeService
       * @example
       * const users = await userService.getAll()
       * console.log(users)
       * // [ { id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, updatedAt: 2020-10-30T12:00:00.000Z } ]
       */
      getAll: async function (): Promise<T[]> {
        try {
          const entities = await this.model.findAll({
            where: {
              isDeleted: {
                [Op.eq]: false
              }
            }
          })
          return entities
        } catch {
          throw new GNXErrorHandler({
            message: `${this.model.name} not found`,
            errorType: GNXErrorTypes.GETTING_ERROR
          })
        }
      },

      /**
       * Get all entities with pagination
       * @param {PaginationType} { page, limit }
       * @returns {Promise<Pagination<T>>}
       * @memberof SequelizeService
       * @example
       * const users = await userService.getAllPaginated({ page: 1, limit: 10 })
       * console.log(users)
       * // { entities: [ { id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, updatedAt: 2020-10-30T12:00:00.000Z } ], page: 1, limit: 10, total: 1 }
       */
      getAllPaginated: async function ({
        page,
        limit
      }: PaginationType): Promise<Pagination<T>> {
        try {
          const data = await this.model.findAndCountAll({
            where: {
              isDeleted: {
                [Op.eq]: false
              }
            },
            offset: (page - 1) * limit,
            limit
          })
          return {
            entities: data.rows,
            currentPage: page,
            totalPages: Math.ceil(data.count / limit)
          }
        } catch {
          throw new GNXErrorHandler({
            message: `${this.model.name} not found`,
            errorType: GNXErrorTypes.GETTING_ERROR
          })
        }
      },

      /**
       * Get all deleted entities
       * @returns {Promise<T[]>}
       * @memberof SequelizeService
       * @example
       * const users = await userService.getAllDeleted()
       * console.log(users)
       * // [ { id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, deletedAt: 2020-10-30T12:00:00.000Z } ]
       */
      getAllDeleted: async function (): Promise<T[]> {
        try {
          const entities = await this.model.findAll({
            where: {
              isDeleted: {
                [Op.eq]: true
              }
            }
          })
          return entities
        } catch {
          throw new GNXErrorHandler({
            message: `${this.model.name} not found`,
            errorType: GNXErrorTypes.GETTING_ERROR
          })
        }
      },

      /**
       * get all entities without pagination and deleted
       *
       * @returns {Promise<T[]>}
       * @memberof SequelizeService
       * @example
       * const users = await userService.getAllWithDeleted()
       * console.log(users)
       * // [ { id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, deletedAt: 2020-10-30T12:00:00.000Z } ]
       */
      getAllWithDeleted: async function (): Promise<T[]> {
        try {
          const entities = await this.model.findAll()
          return entities
        } catch {
          throw new GNXErrorHandler({
            message: `${this.model.name} not found`,
            errorType: GNXErrorTypes.GETTING_ERROR
          })
        }
      },

      /**
       * Get an entity by id
       * @param {ServiceParamsWithId} { id }
       * @returns {Promise<T>}
       * @memberof SequelizeService
       * @example
       * const user = await userService.getById({ id: '5f9d1b2b9f9e4b2b9f9e4b2b' })
       * console.log(user)
       * // { id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, updatedAt: 2020-10-30T12:00:00.000Z }
       */

      getById: async function ({ id }: ServiceParamsWithId): Promise<T | null> {
        try {
          const entity = await this.model.findByPk(id)
          return entity
        } catch {
          throw new GNXErrorHandler({
            message: `${this.model.name} not found`,
            errorType: GNXErrorTypes.ID_NOT_FOUND_ERROR
          })
        }
      },

      /**
       * Create a resource
       * @param {ServiceParamsWithEntity} { entity }
       * @returns {Promise<T>}
       * @memberof SequelizeService
       * @example
       * const user = await userService.create({entity: { name: 'John' }})
       * console.log(user)
       * // { id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, updatedAt: 2020-10-30T12:00:00.000Z }
       */
      create: async function ({ entity }: ServiceParamsWithEntity): Promise<T> {
        try {
          const created = await this.model.create(
            entity as unknown as Creation<T>
          )
          if (!created) throw new Error(`Error creating ${this.model.name}`)
          return created
        } catch (e) {
          throw new GNXErrorHandler({
            message: e.message,
            errorType: GNXErrorTypes.CREATION_ERROR
          })
        }
      },

      /**
       * Update a resource by id
       * @param {ServiceParams} { entity, id }
       * @returns {Promise<T>}
       * @memberof SequelizeService
       * @example
       * const user = await userService.update({ id: '5f9d1b2b9f9e4b2b9f9e4b2b', entity: { name: 'John Doe' } })
       * console.log(user)
       * // { id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John Doe', createdAt: 2020-10-30T12:00:00.000Z, updatedAt: 2020-10-30T12:00:00.000Z }
       */
      update: async function ({ entity, id }: ServiceParams): Promise<T> {
        try {
          const item = await this.model.findByPk(id)
          if (!item) throw new Error(`${this.model.name} not found`)
          const updatedItem = await item.update(entity)
          return updatedItem
        } catch {
          throw new GNXErrorHandler({
            message: `${this.model.name} not found`,
            errorType: GNXErrorTypes.UPDATING_ERROR
          })
        }
      },

      /**
       * Delete a resource by id
       * @param {ServiceParamsWithId} { id }
       * @returns {Promise<void>}
       * @memberof SequelizeService
       * @example
       * await userService.hardDelete({ id: '5f9d1b2b9f9e4b2b9f9e4b2b' })
       */
      hardDelete: async function ({
        id
      }: ServiceParamsWithId): Promise<boolean> {
        try {
          const entity = await this.model.findByPk(id)
          if (!entity) throw new Error(`${this.model.name} not found`)
          await entity.destroy()
          return true
        } catch {
          throw new GNXErrorHandler({
            message: `${this.model.name} not found`,
            errorType: GNXErrorTypes.NOT_FOUND_ERROR
          })
        }
      },

      /**
       * Soft delete a resource by id
       * @param {ServiceParamsWithId} { id }
       * @returns {Promise<boolean>}
       * @memberof SequelizeService
       * @example
       * await userService.softDelete({ id: '5f9d1b2b9f9e4b2b9f9e4b2b' })
       * // true
       */
      softDelete: async function ({
        id
      }: ServiceParamsWithId): Promise<boolean> {
        try {
          const entity = await this.model.findByPk(id)
          if (!entity) throw new Error(`${this.model.name} not found`)
          await entity.update({ isDeleted: true })
          return true
        } catch {
          throw new GNXErrorHandler({
            message: `${this.model.name} not found`,
            errorType: GNXErrorTypes.NOT_FOUND_ERROR
          })
        }
      },

      /**
       * Restore a resource by id
       * @param {ServiceParamsWithId} { id }
       * @returns {Promise<boolean>}
       * @memberof SequelizeService
       * @example
       * await userService.restore({ id: '5f9d1b2b9f9e4b2b9f9e4b2b' })
       * // true
       */
      restore: async function ({ id }: ServiceParamsWithId): Promise<boolean> {
        try {
          const entity = await this.model.findByPk(id)
          if (!entity) throw new Error(`${this.model.name} not found`)
          await entity.update({ isDeleted: false })
          return true
        } catch {
          throw new GNXErrorHandler({
            message: `${this.model.name} not found`,
            errorType: GNXErrorTypes.NOT_FOUND_ERROR
          })
        }
      },

      /**
      * Creates multiple instances of SequelizeEntity in bulk.
      *
      * @param entities - An array of SequelizeEntity objects to be created.
      * @returns A Promise that resolves to an array of created SequelizeEntity objects.
      * @throws GNXErrorHandler if there is an error creating the entities.
      */
      bulkCreate: async function ({ entities }: { entities: T[] }): Promise<T[]> {
        try {
          const created = await this.model.bulkCreate(entities as unknown as Array<Creation<T>>, { returning: true })
          if (!created) throw new Error(`Error creating ${this.model.name}`)
          return created
        } catch (e) {
          throw new GNXErrorHandler({
            message: e.message,
            errorType: GNXErrorTypes.CREATION_ERROR
          })
        }
      },

      /**
      * Deletes all records in the database table associated with the Sequelize model.
      *
      * @returns A promise that resolves to a boolean indicating whether the bulk delete operation was successful.
      * @throws {GNXErrorHandler} If the model is not found in the database.
      */
      bulkDelete: async function (): Promise<boolean> {
        try {
          await this.model.findAll().then(async (entities) => {
            for (const entity of entities) {
              await entity.destroy()
            }
          })
          return true
        } catch {
          throw new GNXErrorHandler({
            message: `${this.model.name} not found`,
            errorType: GNXErrorTypes.NOT_FOUND_ERROR
          })
        }
      },
      /**
       * Retrieves the schema of the model, excluding specified fields.
       * @param exclude - An object specifying the fields to exclude from  the schema.
       * @returns An array of Schema objects representing the model's schema.
       */
      getSchema: function ({ exclude }: ExcludeFields = { exclude: ['updatedAt', 'createdAt'] }): Schema[] {
        exclude = [...exclude, 'updatedAt', 'createdAt']
        const fields = this.model.rawAttributes
        const schema: Schema[] = Object.keys(fields).map((field: string) => {
          const type = fields[field].field
          return {
            field: type,
            allowNull: fields[field].allowNull
          }
        })
        return schema.filter(f => f.allowNull === false && !exclude.includes(f.field))
      }
    })
  }
}

export { sequelizeRepository }

export { sequelizeRepository as SequelizeRepository }
