import type { GenericService, Pagination, PaginationType, Schema, SequelizeBaseEntity, ServiceParams, ServiceParamsWithEntity, ServiceParamsWithId } from '@gnx-utilities/models'
import { GNXErrorHandler, GNXErrorTypes } from '@gnx-utilities/models'
import type { ModelStatic } from 'sequelize'
import { Op } from 'sequelize'
import type { MakeNullishOptional } from 'sequelize/types/utils'

/**
 * Generic service for sequelize
 * @param SequelizeEntity
 * @implements {GenericService<SequelizeEntity>}
 * @example
 * import { SequelizeService } fr om '@gnx-utilities/core'
 * import { type User, UserModel } from '../models'
 *
 * export class UserService extends SequelizeService<User> {
 *    constructor () {
 *      super(UserModel)
 *    }
 * }
 *
 * export const userService = new UserService()
 */

export abstract class SequelizeService<SequelizeEntity extends SequelizeBaseEntity> implements GenericService<SequelizeEntity> {
  /**
   * Creates an instance of SequelizeService.
   * @param {ModelStatic<SequelizeEntity>} model
   * @memberof SequelizeService
   */
  protected constructor (private readonly model: ModelStatic<SequelizeEntity>) {}

  /**
   * Get all entities without pagination and deleted
   * @returns {Promise<SequelizeEntity[]>}
   * @memberof SequelizeService
   * @example
   * const users = await userService.getAll()
   * console.log(users)
   * // [ { id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, updatedAt: 2020-10-30T12:00:00.000Z } ]
   */

  async getAll (): Promise<SequelizeEntity[]> {
    try {
      const entities = await this.model.findAll({
        // @ts-expect-error isDeleted is not defined in the model by default
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
  }

  /**
   * Get all entities with pagination
   * @param {PaginationType} { page, limit }
   * @returns {Promise<Pagination<SequelizeEntity>>}
   * @memberof SequelizeService
   * @example
   * const users = await userService.getAllPaginated({ page: 1, limit: 10 })
   * console.log(users)
   * // { entities: [ { id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, updatedAt: 2020-10-30T12:00:00.000Z } ], page: 1, limit: 10, total: 1 }
   */
  async getAllPaginated ({ page, limit }: PaginationType): Promise<Pagination<SequelizeEntity>> {
    try {
      const data = await this.model.findAndCountAll({ offset: (page - 1) * limit, limit })
      return {
        entities: data.rows.filter(({ isDeleted }) => !isDeleted),
        currentPage: page,
        totalPages: data.count
      }
    } catch {
      throw new GNXErrorHandler({
        message: `${this.model.name} not found`,
        errorType: GNXErrorTypes.GETTING_ERROR
      })
    }
  }
  /**
   * Get all deleted entities
   * @returns {Promise<SequelizeEntity[]>}
   * @memberof SequelizeService
   * @example
   * const users = await userService.getAllDeleted()
   * console.log(users)
   * // [ { id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, deletedAt: 2020-10-30T12:00:00.000Z } ]
   */

  async getAllDeleted (): Promise<SequelizeEntity[]> {
    try {
      const entities = await this.model.findAll({
        // @ts-expect-error isDeleted is not defined in the model by default
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
  }

  /**
   * get all entities without pagination and deleted
   *
   * @returns {Promise<SequelizeEntity[]>}
   * @memberof SequelizeService
   * @example
   * const users = await userService.getAllWithDeleted()
   * console.log(users)
   * // [ { id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, deletedAt: 2020-10-30T12:00:00.000Z } ]
   */
  async getAllWithDeleted (): Promise<SequelizeEntity[]> {
    try {
      const entities = await this.model.findAll()
      return entities
    } catch {
      throw new GNXErrorHandler({
        message: `${this.model.name} not found`,
        errorType: GNXErrorTypes.GETTING_ERROR
      })
    }
  }

  /**
   * Get an entity by id
   * @param {ServiceParamsWithId} { id }
   * @returns {Promise<SequelizeEntity>}
   * @memberof SequelizeService
   * @example
   * const user = await userService.getById({ id: '5f9d1b2b9f9e4b2b9f9e4b2b' })
   * console.log(user)
   * // { id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, updatedAt: 2020-10-30T12:00:00.000Z }
   */

  async getById ({ id }: ServiceParamsWithId): Promise<SequelizeEntity | null> {
    try {
      const entity = await this.model.findByPk(id)
      return entity
    } catch {
      throw new GNXErrorHandler({
        message: `${this.model.name} not found`,
        errorType: GNXErrorTypes.ID_NOT_FOUND_ERROR
      })
    }
  }

  /**
   * Create a resource
   * @param {ServiceParamsWithEntity} { entity }
   * @returns {Promise<SequelizeEntity>}
   * @memberof SequelizeService
   * @example
   * const user = await userService.create({entity: { name: 'John' }})
   * console.log(user)
   * // { id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, updatedAt: 2020-10-30T12:00:00.000Z }
   */
  async create ({ entity }: ServiceParamsWithEntity): Promise<SequelizeEntity> {
    try {
      const created = await this.model.create(entity as unknown as MakeNullishOptional<SequelizeEntity['_creationAttributes']> | undefined)
      if (!created) throw new Error(`Error creating ${this.model.name}`)
      return created
    } catch (e) {
      throw new GNXErrorHandler({
        message: e.message,
        errorType: GNXErrorTypes.CREATION_ERROR
      })
    }
  }

  /**
   * Update a resource by id
   * @param {ServiceParams} { entity, id }
   * @returns {Promise<SequelizeEntity>}
   * @memberof SequelizeService
   * @example
   * const user = await userService.update({ id: '5f9d1b2b9f9e4b2b9f9e4b2b', entity: { name: 'John Doe' } })
   * console.log(user)
   * // { id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John Doe', createdAt: 2020-10-30T12:00:00.000Z, updatedAt: 2020-10-30T12:00:00.000Z }
   */
  async update ({ entity, id }: ServiceParams): Promise<SequelizeEntity> {
    try {
      const item = await this.model.findByPk(id)
      if (!item) throw new Error(`${this.model.name} not found`)
      return await item.update(entity)
    } catch {
      throw new GNXErrorHandler({
        message: `${this.model.name} not found`,
        errorType: GNXErrorTypes.UPDATING_ERROR
      })
    }
  }

  /**
   * Delete a resource by id
   * @param {ServiceParamsWithId} { id }
   * @returns {Promise<void>}
   * @memberof SequelizeService
   * @example
   * await userService.hardDelete({ id: '5f9d1b2b9f9e4b2b9f9e4b2b' })
   */
  async hardDelete ({ id }: ServiceParamsWithId): Promise<boolean> {
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
  }

  /**
   * Soft delete a resource by id
   * @param {ServiceParamsWithId} { id }
   * @returns {Promise<boolean>}
   * @memberof SequelizeService
   * @example
   * await userService.softDelete({ id: '5f9d1b2b9f9e4b2b9f9e4b2b' })
   * // true
   */
  async softDelete ({ id }: ServiceParamsWithId): Promise<boolean> {
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
  }

  /**
   * Restore a resource by id
   * @param {ServiceParamsWithId} { id }
   * @returns {Promise<boolean>}
   * @memberof SequelizeService
   * @example
   * await userService.restore({ id: '5f9d1b2b9f9e4b2b9f9e4b2b' })
   * // true
   */
  async restore ({ id }: ServiceParamsWithId): Promise<boolean> {
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
  }

  /**
   * Map model fields to schema
   * @private
   * @returns {Schema[]}
   * @memberof SequelizeService
   */
  getSchema (): Schema[] {
    const fields = this.model.rawAttributes
    const schema: Schema[] = Object.keys(fields).map((field: string) => {
      const type = fields[field].field
      return {
        field: type,
        allowNull: fields[field].allowNull
      }
    })
    return schema.filter(f => f.allowNull === false && f.field !== 'createdAt' && f.field !== 'updatedAt')
  }
}
