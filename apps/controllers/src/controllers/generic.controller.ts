import type { GenericController } from '.'
import type { Request, Response, NextFunction } from 'express'
import { type SequelizeBaseEntity, type TypegooseBaseEntity, type GenericService, type Pagination, GNXErrorHandler } from '@gnx-utilities/models'

/**
 * Generic controller service that handles CRUD operations for a specific entity type.
 * @template T - The entity type.
 * @template U - The service type that implements the GenericService interface for the entity type.
 */
export class GenericControllerService<T extends SequelizeBaseEntity | TypegooseBaseEntity, U extends GenericService<T>> implements GenericController<T> {
  /**
   * Constructs a new instance of the GenericController class.
   * @param service The service instance used by the controller.
   */
  constructor (protected readonly service: U) {
    this.getAll = this.getAll.bind(this)
    this.getAllPaginated = this.getAllPaginated.bind(this)
    this.getAllDeleted = this.getAllDeleted.bind(this)
    this.getById = this.getById.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.softDelete = this.softDelete.bind(this)
    this.restore = this.restore.bind(this)
    this.hardDelete = this.hardDelete.bind(this)
    this.getAllWithDeleted = this.getAllWithDeleted.bind(this)
    this.bulkCreate = this.bulkCreate.bind(this)
    this.bulkDelete = this.bulkDelete.bind(this)
  }

  /**
   * Retrieves all records.
   *
   * @param _ - The request object (unused).
   * @param res - The response object.
   * @param _next - The next function.
   * @returns A promise that resolves to the response containing the retrieved records.
   */
  async getAll (_: Request, res: Response, _next: NextFunction): Promise<Response<T[]> | any> {
    try {
      const records = await this.service.getAll()
      return res.status(200).json({
        data: records
      })
    } catch (error: any) {
      if (error instanceof GNXErrorHandler) {
        return res.status(300).json({ message: error.message })
      }
      return res.status(500).json({
        message: 'Error while getting all records'
      })
    }
  }

  /**
   * Retrieves all records in a paginated manner.
   * @param req - The request object.
   * @param res - The response object.
   * @param _ - The next function.
   * @returns A promise that resolves to a response containing the paginated records.
   */
  async getAllPaginated (req: Request, res: Response, _next: NextFunction): Promise<Response<Pagination<T>> | any> {
    try {
      const { limit, page: pagination } = req.query
      const page = Number.isNaN(Number(pagination)) ? 1 : Number(pagination)
      if (limit === undefined) return res.status(400).json({ message: 'The limit is required' })
      const records = await this.service.getAllPaginated({ limit: Number(limit), page: Number(page) ?? 1 })
      return res.status(200).json({
        data: records
      })
    } catch (error) {
      if (error instanceof GNXErrorHandler) {
        return res.status(300).json({ message: error.message })
      }
      return res.status(500).json({
        message: 'Error while getting all records'
      })
    }
  }

  /**
   * Retrieves all deleted records.
   *
   * @param _ - The request object (unused).
   * @param res - The response object.
   * @param _next - The next function.
   * @returns A Promise that resolves to the response containing the deleted records.
   */
  async getAllDeleted (_: Request, res: Response, _next: NextFunction): Promise<Response<T[]> | any> {
    try {
      const records = await this.service.getAllDeleted()
      return res.status(200).json({
        data: records
      })
    } catch (error) {
      if (error instanceof GNXErrorHandler) {
        return res.status(300).json({ message: error.message })
      }
      return res.status(500).json({
        message: 'Error while getting all records'
      })
    }
  }

  /**
   * Retrieves all records, including deleted ones.
   *
   * @param _ - The request object (unused).
   * @param res - The response object.
   * @param _next - The next function in the middleware chain.
   * @returns A Promise that resolves to a response containing the retrieved records.
   */
  async getAllWithDeleted (_: Request, res: Response, _next: NextFunction): Promise<Response<T[]> | any> {
    try {
      const records = await this.service.getAllWithDeleted()
      return res.status(200).json({
        data: records
      })
    } catch (error) {
      return res.status(500).json({
        message: 'Error while getting all records'
      })
    }
  }

  /**
   * Retrieves a record by its ID.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @param _next - The next function.
   * @returns A Promise that resolves to the response containing the record.
   */
  async getById (req: Request, res: Response, _next: NextFunction): Promise<Response<T> | any> {
    try {
      const { id } = req.params
      if (id === undefined) return res.status(400).json({ message: 'The id is required' })
      const record = await this.service.getById({ id })
      if (record === null) return res.status(404).json({ message: 'Record not found or not exist' })
      return res.status(200).json({
        data: record
      })
    } catch (error) {
      if (error instanceof GNXErrorHandler) {
        return res.status(300).json({ message: error.message })
      }
      return res.status(500).json({
        message: 'Error while getting record'
      })
    }
  }

  /**
   * Creates a new record.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @param _next - The next function.
   * @returns A promise that resolves to the response containing the created record.
   */
  async create (req: Request, res: Response, _next: NextFunction): Promise<Response<T> | any> {
    try {
      const schema = this.service.getSchema({ exclude: ['id', '_id'] })

      for (const field of schema) {
        if (field.allowNull === false && req.body[field.field] === undefined) {
          return res.status(400).json({ message: `The field ${field.field} is required` })
        }
      }
      const record = await this.service.create({ entity: req.body })
      return res.status(201).json({
        data: record
      })
    } catch (error) {
      if (error instanceof GNXErrorHandler) {
        return res.status(300).json({ message: error.message })
      }
      return res.status(500).json({
        message: 'Error while creating record'
      })
    }
  }

  /**
   * Creates multiple entities in bulk.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @param _next - The next function.
   * @returns A promise that resolves to the response containing the created records.
   * @throws If any required field is missing in the data.
   */
  async bulkCreate (req: Request, res: Response, _next: NextFunction): Promise<Response<T[]> | any> {
    try {
      const { data } = req.body
      const schema = this.service.getSchema({ exclude: ['id', '_id'] })
      data.forEach((item) => {
        for (const field of schema) {
          if (field.allowNull === false && item[field.field] === undefined) {
            throw new Error(`The field ${field.field} is required`)
          }
        }
      })
      const records = await this.service.bulkCreate({ entities: data })
      return res.status(201).json({
        data: records
      })
    } catch (error) {
      if (error instanceof GNXErrorHandler) {
        return res.status(300).json({ message: error.message })
      }
      return res.status(500).json({
        message: 'Error while creating records'
      })
    }
  }

  /**
   * Updates a record.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @param _next - The next function.
   * @returns A Promise that resolves to the updated record.
   */
  async update (req: Request, res: Response, _next: NextFunction): Promise<Response<T> | any> {
    try {
      const { id } = req.params
      if (id === undefined) return res.status(400).json({ message: 'The id is required' })
      const record = await this.service.update({ entity: req.body, id })
      return res.status(200).json({
        data: record
      })
    } catch (error) {
      if (error instanceof GNXErrorHandler) {
        return res.status(300).json({ message: error.message })
      }
      return res.status(500).json({
        message: 'Error while updating record'
      })
    }
  }

  /**
    * Soft deletes a resource by its ID.
    * @param req - The request object.
    * @param res - The response object.
    * @param _next - The next function.
    * @returns A promise that resolves to a response containing a boolean indicating the success of the operation.
    */
  async softDelete (req: Request, res: Response, _next: NextFunction): Promise<Response<boolean> | any> {
    try {
      const { id } = req.params
      if (id === undefined) return res.status(400).json({ message: 'The id is required' })
      await this.service.softDelete({ id })
      return res.status(200).json({
        data: true
      })
    } catch (error) {
      if (error instanceof GNXErrorHandler) {
        return res.status(300).json({ message: error.message })
      }
      return res.status(500).json({
        message: 'Error while soft delete'
      })
    }
  }

  /**
   * Restores a resource by its ID.
   * @param req - The request object.
   * @param res - The response object.
   * @param _next - The next function.
   * @returns A Promise that resolves to a response containing a boolean indicating the success of the restore operation.
   */
  async restore (req: Request, res: Response, _next: NextFunction): Promise<Response<boolean> | any> {
    try {
      const { id } = req.params
      if (id === undefined) return res.status(400).json({ message: 'The id is required' })
      await this.service.restore({ id })
      return res.status(200).json({
        data: true
      })
    } catch (error) {
      if (error instanceof GNXErrorHandler) {
        return res.status(300).json({ message: error.message })
      }
      return res.status(500).json({
        message: 'Error while restore'
      })
    }
  }

  /**
   * Deletes a record permanently from the database.
   * @param req - The request object.
   * @param res - The response object.
   * @param _next - The next function.
   * @returns A Promise that resolves to a boolean indicating the success of the operation.
   */
  async hardDelete (req: Request, res: Response, _next: NextFunction): Promise<Response<boolean> | any> {
    try {
      const { id } = req.params
      if (id === undefined) return res.status(400).json({ message: 'The id is required' })
      await this.service.hardDelete({ id })
      return res.status(200).json({
        data: true
      })
    } catch (error) {
      if (error instanceof GNXErrorHandler) {
        return res.status(300).json({ message: error.message })
      }
      return res.status(500).json({
        message: 'Error while hard delete'
      })
    }
  }

  async bulkDelete (_: Request, res: Response, _next: NextFunction): Promise<Response<boolean> | any> {
    try {
      await this.service.bulkDelete()
      return res.status(200).json({ data: true })
    } catch (error) {
      if (error instanceof GNXErrorHandler) {
        return res.status(300).json({ message: error.message })
      }
      return res.status(500).json({ message: 'Error while delete in bulk' })
    }
  }
}
