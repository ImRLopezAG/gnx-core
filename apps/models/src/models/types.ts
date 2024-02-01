type Guid = `${string}-${string}-${string}-${string}-${string}`

interface Entity {
  createdAt?: Date
  updatedAt?: Date
  isDeleted?: boolean
}

export interface ServiceParams {
  id: Id
  entity: Entity & Record<string, any>
}

export type ServiceParamsWithId = Omit<ServiceParams, 'entity'>

export type ServiceParamsWithEntity = Omit<ServiceParams, 'id'>

export type Id = Guid | string | number

export type TypegooseEntity = Entity & {
  _id: any
}

export type SequelizeEntity = Entity & {
  id: Id
}

export interface PaginationType {
  page: number
  limit: number
}

export interface Pagination<T extends Entity> {
  entities: T[]
  currentPage: number
  totalPages: number
}

export interface Schema {
  field: string | any
  allowNull: boolean | any
}

export interface ExcludeFields {
  exclude: string[]
}
export interface GenericService<T extends Entity> {
  getAll: () => Promise<T[]>
  getAllPaginated: ({ page, limit }: PaginationType) => Promise<Pagination<T>>
  getAllDeleted: () => Promise<T[]>
  getAllWithDeleted: () => Promise<T[]>
  getById: ({ id }: ServiceParamsWithId) => Promise<T | null>
  create: ({ entity }: ServiceParamsWithEntity) => Promise<T>
  update: ({ entity, id }: ServiceParams) => Promise<T>
  softDelete: ({ id }: ServiceParamsWithId) => Promise<boolean>
  restore: ({ id }: ServiceParamsWithId) => Promise<boolean>
  hardDelete: ({ id }: ServiceParamsWithId) => Promise<boolean>
  bulkCreate: ({ entities }: { entities: T[] }) => Promise<T[]>
  bulkDelete: () => Promise<boolean>
  getSchema: ({ exclude }?: ExcludeFields) => Schema[]
}

export interface GNXError {
  message: string
  errorType: GNXErrorTypes
  originalError?: Error
}

export enum GNXErrorTypes {
  DB_ERROR = 1,
  FIELD_VALIDATION_ERROR,
  BAD_REQUEST,
  CREATION_ERROR,
  UPDATING_ERROR,
  DELETING_ERROR,
  NOT_FOUND_ERROR,
  GETTING_ERROR,
  ID_NOT_FOUND_ERROR,
  UNEXPECTED_ERROR
}
