import assert from 'node:assert'
import { describe, it } from 'node:test'
import { SequelizeUserService, sequelize, type SequelizeUser } from './sequelize'
import { TypegooseUserService, connection, type TypegooseUser } from './typegoose'

import { getRepository } from '../src'

const entity = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@testing.com'
} as const

const withId = {
  ...entity,
  id: ''
}

await describe('Sequelize Tests', async () => {
  const userService = getRepository<SequelizeUser>({
    repository: SequelizeUserService
  })

  await sequelize.sync({ alter: true }).catch((err) => {
    throw new Error(`Test: Unable to connect database ${err}`)
  })

  await it('sequelize #create - should create user', async () => {
    const createdUser = await userService.create({
      entity
    })
    withId.id = createdUser.dataValues.id
    assert.ok(createdUser)
    assert.strictEqual(createdUser.firstName, 'John')
  })

  await it('sequelize #getAll - should get all users', async () => {
    const foundUser = await userService.getAll()
    assert.ok(foundUser)
    assert.strictEqual(foundUser.every((user) => user.dataValues.isDeleted), false)
  })

  await it('sequelize #getById - should get user by id', async () => {
    const foundUser = await userService.getById({ id: withId.id })
    assert.ok(foundUser)
    assert.strictEqual(foundUser.firstName, entity.firstName)
  })

  await it('sequelize #update - should update user', async () => {
    const updatedUser = await userService.update({
      entity: { firstName: 'Jane' },
      id: withId.id
    })
    if (updatedUser) {
      withId.firstName = updatedUser.dataValues.firstName
      withId.lastName = updatedUser.dataValues.lastName
    }
    assert.ok(updatedUser)
    assert.strictEqual(updatedUser.firstName, withId.firstName)
    assert.strictEqual(updatedUser.lastName, withId.lastName)
  })

  await it('sequelize #softDelete - should soft delete user', async () => {
    assert.ok(await userService.softDelete({ id: withId.id }))
  })

  await it('sequelize #restore - should restore user', async () => {
    assert.ok(await userService.restore({ id: withId.id }))
  })

  await it('sequelize #hardDelete - should hard delete user', async () => {
    const user = await userService.create({ entity })
    const hard = await userService.hardDelete({ id: user.dataValues.id })
    assert.ok(hard)
  })

  await it('sequelize #getAllDeleted - should get all deleted users', async () => {
    const deleted = {
      isDeleted: true,
      ...entity
    }
    await userService.bulkCreate({ entities: Array(3).fill(deleted) })
    const users = await userService.getAllDeleted()
    assert.ok(users)
    assert.strictEqual(users.length >= 3, true)
    assert.strictEqual(users.every((user) => user.dataValues.isDeleted), true)
  })

  await it('sequelize #getAllWithDeleted - should get all users with deleted', async () => {
    const users = await userService.getAllWithDeleted()
    assert.ok(users)
    assert.strictEqual(users.length > 0, true)
    assert.strictEqual(users.some((user) => user.dataValues.isDeleted), true)
  })

  await it('sequelize #getAllPaginated - should get all paginated users', async () => {
    await userService.bulkCreate({ entities: Array(10).fill(entity) })
    const users = await userService.getAllPaginated({ limit: 3, page: 1 })
    const all = await userService.getAll()

    assert.ok(users)
    assert.strictEqual(users.entities.length, 3)
    assert.strictEqual(users.totalPages, Math.ceil(all.length / 3))
  })

  await it('sequelize #bulkDelete - should bulk delete users', async () => {
    const users = await userService.bulkDelete()
    assert.ok(users)
  })

  await it('sequelize #bulkCreate - should bulk create users', async () => {
    const users = await userService.bulkCreate({ entities: Array(2).fill(entity) })
    assert.ok(users)
    assert.strictEqual(users.length, 2)
    await userService.bulkDelete()
  })

  await it('sequelize #schema - should return the schema', () => {
    const schema = userService.getSchema({ exclude: ['id'] })
    assert.strictEqual(schema.length === 0, true)
  })
})

await describe('Typegoose Tests', async () => {
  await connection().then(() => {
    console.log('Typegoose connected! 🍃')
  }).catch((err) => {
    throw new Error(`Test: Unable to connect database ${err}`)
  })

  const userService = getRepository<TypegooseUser>({
    repository: TypegooseUserService
  })

  await it('typegoose #create - should create user', async () => {
    const createdUser = await userService.create({ entity })
    withId.id = createdUser._id
    assert.ok(createdUser)
    assert.strictEqual(createdUser.firstName, 'John')
  })

  await it('Typegoose #getAll - should get all users', async () => {
    const users = await userService.getAll()
    assert.ok(users)
    assert.strictEqual(users.every((user) => user.isDeleted), false)
  })

  await it('typegoose #getById - should get user by id', async () => {
    const founded = await userService.getById({ id: withId.id })
    assert.ok(founded)
    assert.strictEqual(founded.firstName, 'John')
  })

  await it('typegoose #update - should update user', async () => {
    const updated = await userService.update({
      entity: { firstName: 'Jane' },
      id: withId.id
    })

    assert.ok(updated)
    assert.strictEqual(updated.firstName, 'Jane')
    assert.strictEqual(updated.lastName, withId.lastName)
  })

  await it('typegoose #softDelete - should soft delete user', async () => {
    const deleted = await userService.softDelete({ id: withId.id })

    assert.ok(deleted)
  })

  await it('typegoose #restore - should restore user', async () => {
    const restored = await userService.restore({ id: withId.id })

    assert.ok(restored)
  })

  await it('typegoose #hardDelete - should hard delete user', async () => {
    const hard = await userService.hardDelete({ id: withId.id })

    assert.ok(hard)
  })

  await it('typegoose #getAllWithDeleted - should get all users with deleted', async () => {
    const deleted = {
      isDeleted: true,
      ...entity
    }

    for (let i = 0; i < 3; i++) {
      await userService.create({ entity: deleted })
    }

    const users = await userService.getAllWithDeleted()
    assert.ok(users)
    assert.strictEqual(users.length > 2, true)
    assert.strictEqual(users.some((user) => user.isDeleted), true)
  })

  await it('typegoose #getAllDeleted - should get all deleted users', async () => {
    const users = await userService.getAllDeleted()
    assert.ok(users)
    assert.strictEqual(users.length > 0, true)
    assert.strictEqual(users.every((user) => user.isDeleted), true)
  })

  await it('typegoose #getAllPaginated - should get all paginated users', async () => {
    await userService.bulkCreate({ entities: Array(10).fill(entity) })
    const users = await userService.getAllPaginated({ limit: 3, page: 1 })
    const all = await userService.getAll()
    assert.ok(users)
    assert.strictEqual(users.entities.length, 3)
    assert.strictEqual(users.totalPages > 0, true)
    assert.strictEqual(users.totalPages, Math.ceil(all.length / 3))
  })

  await it('typegoose #bulkDelete - should bulk delete users', async () => {
    const deleted = await userService.bulkDelete()
    assert.ok(deleted)
  })

  await it('typegoose #bulkCreate - should bulk create users', async () => {
    const users = await userService.bulkCreate({ entities: Array(2).fill(entity) })

    assert.ok(users)
    assert.strictEqual(users.length, 2)
    await userService.bulkDelete()
  })

  await it('typegoose #schema - should return the schema', () => {
    const schema = userService.getSchema()
    assert.strictEqual(schema.length === 0, true)
  })
}).finally(() => {
  setTimeout(() => {
    process.exit()
  }, 1000)
})
