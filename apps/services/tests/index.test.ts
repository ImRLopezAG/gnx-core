import { connect } from 'mongoose'
import assert from 'node:assert'
import { describe, it } from 'node:test'
import { SequelizeUserService, sequelize } from './sequelize'
import { TypegooseUserService } from './typegoose'

const entity = {
  firstName: 'John',
  lastName: 'Doe'
}

type Sequelize = typeof entity & { id: number | string }
type Typegoose = typeof entity & { _id?: string }

describe('Sequelize Tests', async () => {
  const userService = new SequelizeUserService()
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
    const user = await userService.create({ entity })
    const soft = await userService.softDelete({ id: user.id })

    assert.ok(soft)
    await userService.hardDelete({ id: user.id })
  })

  await it('sequelize - should restore user', async () => {
    const user = await userService.create({ entity })
    await userService.softDelete({ id: user.id })
    const restore = await userService.restore({ id: user.id })

    assert.ok(restore)
  })

  await it('sequelize - should hard delete user', async () => {
    const user = await userService.create({ entity })
    const hard = await userService.hardDelete({ id: user.id })
    assert.ok(hard)
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

  await it('sequelize - should return the schema', () => {
    const schema = userService.getSchema({ exclude: ['id'] })
    assert.ok(schema)
  })
}).catch((err) => {
  console.log(err)
})

describe('Typegoose Tests', async () => {
  const uri = 'mongodb://localhost:27017/?readPreference=primary&ssl=false&directConnection=true'
  const userService = new TypegooseUserService()

  connect(uri, {
    dbName: 'test'
  })
    .then(() => {
      console.log('Mongo db connected🍃')
    })
    .catch((err) => {
      throw new Error(`Test: Unable to connect to mongodb ${err}`)
    })

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
    assert.strictEqual(foundUser.isDeleted, false)
    assert.strictEqual(foundUser.firstName, user.firstName)
  })

  await it('typegoose - should hard delete user', async () => {
    const hard = await userService.hardDelete({
      id: String(user._id)
    })
    assert.ok(hard)
  })

  await it('typegoose - should return the schema', () => {
    const schema = userService.getSchema()
    assert.ok(schema)
  })
}).catch(() => {
  console.log('error')
}).finally(() => {
  setTimeout(() => {
    process.exit()
  }, 1000)
})
