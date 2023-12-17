type Guid = `${string}-${string}-${string}-${string}-${string}`

interface Entity {
  createdAt: Date
  updatedAt: Date
}

export interface ServiceParams {
  id: Id
  entity: Entity
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

export interface GenericService<T extends Entity> {
  getAll: () => Promise<T[]>
  getById: ({ id }: ServiceParamsWithId) => Promise<T | null>
  create: ({ entity }: ServiceParamsWithEntity) => Promise<T>
  update: ({ entity, id }: ServiceParams) => Promise<T>
  delete: ({ id }: ServiceParamsWithId) => void
  getSchema: () => Schema[]
}

export interface Schema {
  field: string | any
  allowNull: boolean | any
}
