import type { GenericService, Pagination, PaginationType, Schema, ServiceParams, ServiceParamsWithEntity, ServiceParamsWithId, TypegooseBaseEntity } from '@gnx-utilities/models'
import { GNXErrorHandler, GNXErrorTypes } from '@gnx-utilities/models'
import type { ReturnModelType } from '@typegoose/typegoose'
import type { AnyParamConstructor } from '@typegoose/typegoose/lib/types'

interface ServiceCrud<T extends TypegooseBaseEntity> {
  model: ReturnModelType<AnyParamConstructor<T>>
}

function typegooseRepository<T extends TypegooseBaseEntity> ({ model }: ServiceCrud<T>): ClassDecorator {
  return function func (constructor) {
    Object.assign(constructor.prototype, {
      model,
     /**
   * Get all entities
   * @returns {Promise<T[]>}
   * @memberof TypegooseService
   * @example
   * const users = await userService.getAll()
   * console.log(users)
   * // [ { _id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, updatedAt: 2020-10-30T12:00:00.000Z } ]
   */
  getAll :async function (): Promise<T[]> {
    try {
      const entities = await this.model
        .find()
        .where('deletedAt')
        .ne(false)
        .exec()
      return entities as unknown as T[]
    } catch {
      throw new GNXErrorHandler({
        message: `${this.model.modelName} not found`,
        errorType: GNXErrorTypes.GETTING_ERROR
      })
    }
  },

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
  getAllPaginated :async function ({
    page,
    limit
  }: PaginationType): Promise<Pagination<T>> {
    try {
      const entities = await this.model
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec()
      const total = await this.model.countDocuments().exec()
      return {
        entities: entities as unknown as T[],
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      }
    } catch {
      throw new GNXErrorHandler({
        message: `${this.model.modelName} not found`,
        errorType: GNXErrorTypes.GETTING_ERROR
      })
    }
  },

  /**
   * Get all deleted entities
   * @returns {Promise<SequelizeEntity[]>}
   * @memberof SequelizeService
   * @example
   * const users = await userService.getAllDeleted()
   * console.log(users)
   * // [ { id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, deletedAt: 2020-10-30T12:00:00.000Z } ]
   */
  getAllDeleted :async function (): Promise<T[]> {
    try {
      const entities = await this.model
        .find()
        .where('deletedAt')
        .ne(true)
        .exec()
      return entities as unknown as T[]
    } catch {
      throw new GNXErrorHandler({
        message: `Error retrieving ${this.model.modelName} entities`,
        errorType: GNXErrorTypes.GETTING_ERROR
      })
    }
  },

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
  getAllWithDeleted :async function (): Promise<T[]> {
    try {
      const entities = await this.model.find().exec()
      return entities as unknown as T[]
    } catch {
      throw new GNXErrorHandler({
        message: `Error retrieving ${this.model.modelName} entities`,
        errorType: GNXErrorTypes.GETTING_ERROR
      })
    }
  },

  /**
   * Get an entity by id
   * @param {ServiceParamsWithId} { id }
   * @returns {Promise<T>}
   * @memberof TypegooseService
   * @example
   * const user = await userService.getById({ id: '5f9d1b2b9f9e4b2b9f9e4b2b' })
   * console.log(user)
   * // { _id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, updatedAt: 2020-10-30T12:00:00.000Z }
   */
  getById :async function ({ id }: ServiceParamsWithId): Promise<T> {
    try {
      const entity = await this.model.findById(id).exec()
      if (!entity) throw new Error(`${this.model.modelName} not found`)
      return entity as unknown as T
    } catch {
      throw new GNXErrorHandler({
        message: `${this.model.modelName} not found`,
        errorType: GNXErrorTypes.GETTING_ERROR
      })
    }
  },

  /**
   * Create a resource
   * @param {ServiceParamsWithEntity} { entity }
   * @returns {Promise<T>}
   * @memberof TypegooseService
   * @example
   * const user = await userService.create({ entity: { name: 'John' } })
   * console.log(user)
   * // { _id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'John', createdAt: 2020-10-30T12:00:00.000Z, updatedAt: 2020-10-30T12:00:00.000Z }
   */
  create :async function ({ entity }: ServiceParamsWithEntity): Promise<T> {
    try {
      const created = await this.model.create(entity)
      if (!created) throw new Error('Error creating entity')
      return created as unknown as T
    } catch {
      throw new GNXErrorHandler({
        message: `Error creating ${this.model.modelName}`,
        errorType: GNXErrorTypes.CREATION_ERROR
      })
    }
  },

  /**
   * Update a resource
   * @param {ServiceParams} { id, entity }
   * @returns {Promise<T>}
   * @memberof TypegooseService
   * @example
   * const user = await userService.update({ id: '5f9d1b2b9f9e4b2b9f9e4b2b', entity: { name: 'Johnny' } })
   * console.log(user)
   * // { _id: 5f9d1b2b9f9e4b2b9f9e4b2b, name: 'Johnny', createdAt: 2020-10-30T12:00:00.000Z, updatedAt: 2020-10-30T12:00:00.000Z }
   */
  update :async function ({ id, entity }: ServiceParams): Promise<T> {
    try {
      const updatedEntity = await this.model.findByIdAndUpdate(id, entity).exec()
      if (!updatedEntity) throw new Error('Entity not found')
      return await this.getById({ id })
    } catch {
      throw new GNXErrorHandler({
        message: `Error updating ${this.model.modelName} not found`,
        errorType: GNXErrorTypes.UPDATING_ERROR
      })
    }
  },

  /**
   * Delete a resource
   * @param {ServiceParamsWithId} { id }
   * @returns {Promise<void>}
   * @memberof TypegooseService
   * @example
   * await userService.hardDelete({ id: '5f9d1b2b9f9e4b2b9f9e4b2b' })
   */
  hardDelete :async function ({ id }: ServiceParamsWithId): Promise<boolean> {
    try {
      const deleted = await this.model.findByIdAndDelete(id).exec()
      if (!deleted) throw new Error('Error deleting entity')
      return true
    } catch {
      throw new GNXErrorHandler({
        message: `${this.model.modelName} not found`,
        errorType: GNXErrorTypes.DELETING_ERROR
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
  softDelete :async function ({ id }: ServiceParamsWithId): Promise<boolean> {
    try {
      const entity = await this.getById({ id })
      if (!entity) throw new Error(`${this.model.modelName} not found`)
      entity.isDeleted = true
      await this.update({ id, entity })
      return true
    } catch {
      throw new GNXErrorHandler({
        message: `${this.model.modelName} not found`,
        errorType: GNXErrorTypes.DELETING_ERROR
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
  restore :async function ({ id }: ServiceParamsWithId): Promise<boolean> {
    try {
      const entity = await this.getById({ id })
      if (!entity) throw new Error(`${this.model.modelName} not found`)
      entity.isDeleted = false
      await this.update({ id, entity })
      return true
    } catch {
      throw new GNXErrorHandler({
        message: `${this.model.modelName} not found`,
        errorType: GNXErrorTypes.UPDATING_ERROR
      })
    }
  },

  /**
   * Get schema
   * @returns {Schema[]}
   * @memberof GenericSequelizeService
   * @example
   * const schema = await userService.getSchema()
   * console.log(schema)
   * // [
   * //   { field: 'name', allowNull: false }
   * // ]
   */
  getSchema: function (): Schema[] {
    const schemaPaths = this.model.schema.paths
    const schema: Schema[] = Object.keys(schemaPaths).map((field: string) => {
      const schemaPath = schemaPaths[field]
      return {
        field,
        allowNull: !schemaPath.isRequired
      }
    })
    return schema.filter(
      (f) =>
        f.allowNull === false &&
        f.field !== 'createdAt' &&
        f.field !== 'updatedAt' &&
        f.field !== '_id'
    )
  }
    }) as GenericService<T>
  }
}

export { typegooseRepository }

export { typegooseRepository as TypegooseRepository }
