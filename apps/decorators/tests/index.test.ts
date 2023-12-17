import { connect } from 'mongoose'
import assert from 'node:assert'
import { describe, it } from 'node:test'
import { SequelizeUserService, sequelize, type SequelizeUser } from './sequelize'
import { TypegooseUserService, type TypegooseUser } from './typegoose'

import { getRepository } from '../src'

const entity = {
  firstName: 'John',
  lastName: 'Doe'
}

type Sequelize = typeof entity & { id: number | string }
type Typegoose = typeof entity & { _id?: string }

describe('Sequelize Tests', async () => {
  const userService = getRepository<SequelizeUser>({ repository: SequelizeUserService })

  let user: Sequelize
  await sequelize.sync({ alter: true }).catch((err) => {
    throw new Error(`Test: Unable to connect database ${err}`)
  })

  await it('sequelize - should create user', async () => {
    const createdUser = await userService.create({
      entity
    })
    user = createdUser
    assert.ok(createdUser)
    assert.strictEqual(createdUser.firstName, 'John')
  })

  await it('sequelize - should get all users', async () => {
    const foundUser = await userService.getAll()
    assert.ok(foundUser)
  })

  await it('sequelize - should get user by id', async () => {
    const foundUser = await userService.getById({ id: user.id })
    assert.ok(foundUser)
    assert.strictEqual(foundUser.firstName, user.firstName)
  })

  await it('sequelize - should update user', async () => {
    const updatedUser = await userService.update({
      entity: { firstName: 'Jane' },
      id: user.id
    })
    if (updatedUser) {
      user = updatedUser
    }
    assert.ok(updatedUser)
    assert.strictEqual(updatedUser.firstName, user.firstName)
    assert.strictEqual(updatedUser.lastName, user.lastName)
  })

  await it('sequelize - should soft delete user', async () => {
    const soft = await userService.softDelete({ id: user.id })
    const foundUser = await userService.getById({ id: user.id })
    if (!foundUser) {
      throw new Error('User not found')
    }
    assert.ok(soft)
    assert.strictEqual(foundUser.isDeleted, true)
    assert.strictEqual(foundUser.firstName, user.firstName)
  })

  await it('sequelize - should get all deleted users', async () => {
    const deleted = {
      isDeleted: true,
      ...entity
    }
    for (let i = 0; i < 3; i++) {
      await userService.create({ entity: deleted })
    }
    const users = await userService.getAllDeleted()
    assert.ok(users)
    assert.strictEqual(users.length > 2, true)
  })

  await it('sequelize - should restore user', async () => {
    const restored = await userService.restore({ id: user.id })
    const foundUser = await userService.getById({ id: user.id })
    assert.ok(restored)
    assert.ok(foundUser)
    assert.strictEqual(foundUser.isDeleted, false)
    assert.strictEqual(foundUser.firstName, user.firstName)
  })

  await it('sequelize - should hard delete user', async () => {
    const hard = await userService.hardDelete({ id: user.id })
    const foundUser = await userService.getById({ id: user.id })
    assert.ok(hard)
    assert.strictEqual(foundUser, null)
  })
  await it('should greet with message', () => {
    const message = userService.greeting()
    assert.strictEqual(message, 'Hello, world!')
  })
}).catch((err) => {
  console.log(err)
})

describe('Typegoose Tests', async () => {
  const uri = 'mongodb://localhost:27017/?readPreference=primary&ssl=false&directConnection=true'
  await connect(uri, {
    dbName: 'test'
  })
    .then(() => {
      console.log('Mongo db connected🍃')
    })
    .catch((err) => {
      throw new Error(`Test: Unable to connect to mongodb ${err}`)
    })

  const userService = getRepository<TypegooseUser>({ repository: TypegooseUserService })
  let user: Typegoose
  await it('typegoose - should create user', async () => {
    const createdUser = await userService.create({
      entity
    })
    assert.ok(createdUser)
    user = createdUser
    assert.strictEqual(createdUser.firstName, 'John')
  })

  await it('typegoose - should get all users', async () => {
    const foundUser = await userService.getAll()
    assert.ok(foundUser)
  })

  await it('typegoose - should get user by id', async () => {
    const foundUser = await userService.getById({
      id: String(user._id)
    })
    assert.ok(foundUser)
    assert.strictEqual(foundUser.firstName, user.firstName)
  })

  await it('typegoose - should update user', async () => {
    const updatedUser = await userService.update({
      entity: { firstName: 'Jane' },
      id: String(user._id)
    })
    if (updatedUser) {
      user = updatedUser
    }
    const foundUser = await userService.getById({
      id: String(user._id)
    })
    assert.ok(updatedUser)
    assert.ok(foundUser)
    assert.strictEqual(foundUser.firstName, updatedUser.firstName)
  })

  await it('typegoose - should soft delete user', async () => {
    const soft = await userService.softDelete({
      id: String(user._id)
    })
    const foundUser = await userService.getById({
      id: String(user._id)
    })
    assert.ok(soft)
    assert.ok(foundUser)
    assert.strictEqual(foundUser.isDeleted, true)
    assert.strictEqual(foundUser.firstName, user.firstName)
  })

  await it('typegoose - should get all deleted users', async () => {
    const deleted = {
      isDeleted: true,
      ...entity
    }
    for (let i = 0; i < 3; i++) {
      await userService.create({
        entity: deleted
      })
    }
    const users = await userService.getAllDeleted()
    assert.ok(users)
    assert.strictEqual(users.length > 2, true)
  })

  await it('typegoose - should restore user', async () => {
    const restored = await userService.restore({
      id: String(user._id)
    })
    const foundUser = await userService.getById({
      id: String(user._id)
    })
    assert.ok(restored)
    assert.ok(foundUser)
    assert.strictEqual(foundUser.isDeleted, false)
    assert.strictEqual(foundUser.firstName, user.firstName)
  })

  await it('typegoose - should hard delete user', async () => {
    const hard = await userService.hardDelete({
      id: String(user._id)
    })
    assert.ok(hard)
  })

  await it('should greet with message', () => {
    const message = userService.greeting()
    assert.strictEqual(message, 'Hello, world!')
  })
}).catch(() => {
  console.log('error')
}).finally(() => {
  setTimeout(() => {
    process.exit()
  }, 1000)
})
