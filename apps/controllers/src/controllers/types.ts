import type { SequelizeBaseEntity, TypegooseBaseEntity, Pagination } from '@gnx-utilities/models'
import type { NextFunction, Request, Response } from 'express'

export interface GenericController<T extends SequelizeBaseEntity | TypegooseBaseEntity> {
  getAll: (req: Request, res: Response, next: NextFunction) => Promise<Response<T[]> | any>
  getAllPaginated: (req: Request, res: Response, next: NextFunction) => Promise<Response<Pagination<T>>>
  getAllDeleted: (req: Request, res: Response, next: NextFunction) => Promise<Response<T[]>>
  getAllWithDeleted: (req: Request, res: Response, next: NextFunction) => Promise<Response<T[]>>
  getById: (req: Request, res: Response, next: NextFunction) => Promise<Response<T>>
  create: (req: Request, res: Response, next: NextFunction) => Promise<Response<T>>
  update: (req: Request, res: Response, next: NextFunction) => Promise<Response<T>>
  softDelete: (req: Request, res: Response, next: NextFunction) => Promise<Response<boolean>>
  restore: (req: Request, res: Response, next: NextFunction) => Promise<Response<boolean>>
  hardDelete: (req: Request, res: Response, next: NextFunction) => Promise<Response<boolean>>
  bulkCreate: (req: Request, res: Response, next: NextFunction) => Promise<Response<T[]>>
  bulkDelete: (req: Request, res: Response, next: NextFunction) => Promise<Response<boolean>>
}
