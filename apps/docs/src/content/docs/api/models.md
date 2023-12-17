---
title: Models
description: Get started building fastest services with GNX
---

Models API contains all base types of the `GNX` library. It is technically the core of the library.

## 🧪 Types

### `GUID`

The `GUID` type is a string that represents a unique identifier. It is used to identify a model in the database.

```ts
type GUID = `${string}-${string}-${string}-${string}-${string}`
```

### `Id`

The `Id` type is a string that represents a unique identifier. It is used to identify a model in the database.

```ts
type ID = GUID | string | number
```

### `ServiceParamsWithId`

The `ServiceParamsWithId` type is used to pass the `id` parameter to the service methods.

```ts
type ServiceParamsWithId = Omit<ServiceParams, 'entity'>
```

### `ServiceParamsWithEntity`

The `ServiceParamsWithEntity` type is used to pass the `entity` parameter to the service methods.
```ts
type ServiceParamsWithEntity = Omit<ServiceParams, 'id'>
```

### `SequelizeEntity`

The `SequelizeEntity` type is used to pass the `entity` parameter to the service methods.
```ts
type SequelizeEntity = Entity & {
  id: Id
}
```

### `TypegooseEntity`

The `TypegooseEntity` type is used to pass the `entity` parameter to the service methods.
```ts
type TypegooseEntity = Entity & {
  _id: any
}
```


## 🧪 Interfaces 

### `Entity`

The `Entity` interface is the base interface for all models. It contains the `createdAt` and `updatedAt` fields.

```ts
interface Entity {
  createdAt?: Date
  updatedAt?: Date
  isDeleted?: boolean
}
```

### `Schema`

The `Schema` interface is the base interface for all schemas. It contains the `field` and `allowNull` fields.
```ts 
interface Schema {
  field: string | any
  allowNull: boolean | any
}
```

### `Pagination`

The `Pagination` interface is the base interface for all paginated responses. It contains the `data`, `total`, `page` and `limit` fields.
```ts
interface Pagination<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
```

### `PaginationType`

The `PaginationType` interface is the base interface for all paginated requests. It contains the `page` and `limit` fields.
```ts
interface PaginationType {
  page: number
  limit: number
}
```

### `GenericService`

The `GenericService` interface is the base interface for all services. It contains the basic CRUD operations and the `getSchema` method.

```ts
interface GenericService<T extends Entity> {
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
  getSchema: () => Schema[]
}
```
### `ServiceParams`

The `ServiceParams` interface is the base interface for all service parameters. It contains the `id` and `entity` fields.
```ts
interface ServiceParams {
  id: Id
  entity: Entity & Record<string, any>
}
```

## ⚠️ Exceptions

### `GNXError`

The `GNXError` interface is the base interface for all exceptions. It contains the `message` and `errorType` fields.

```ts
interface GNXError {
  message: string
  errorType: GNXErrorTypes
}
```

### `GNXErrorTypes`

The `GNXErrorTypes` enum is the base enum for all exceptions. It contains the `message` and `errorType` fields.

```ts
enum GNXErrorTypes {
  DB_ERROR = 1,
  FIELD_VALIDATION_ERROR,
  BAD_REQUEST,
  CREATION_ERROR,
  UPDATING_ERROR,
  DELETING_ERROR,
  NOT_FOUND_ERROR,
  GETTING_ERROR,
  ID_NOT_FOUND_ERROR,
  UNEXPECTED_ERROR,
}

```