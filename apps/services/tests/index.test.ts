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
  const sequelizeUserService = new SequelizeUserService()
  let user: Sequelize
  await sequelize.sync({ alter: true }).catch((err) => {
    throw new Error(`Test: Unable to connect database ${err}`)
  })

  await it('sequelize - should create user', async () => {
    const createdUser = await sequelizeUserService.create({
      entity
    })
    user = createdUser
    assert.ok(createdUser)
    assert.strictEqual(createdUser.firstName, 'John')
  })

  await it('sequelize - should get all users', async () => {
    const foundUser = await sequelizeUserService.getAll()
    assert.ok(foundUser)
  })

  await it('sequelize - should get user by id', async () => {
    const foundUser = await sequelizeUserService.getById({ id: user.id })
    assert.ok(foundUser)
    assert.strictEqual(foundUser.firstName, user.firstName)
  })

  await it('sequelize - should update user', async () => {
    const updatedUser = await sequelizeUserService.update({
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
    const soft = await sequelizeUserService.softDelete({ id: user.id })
    const foundUser = await sequelizeUserService.getById({ id: user.id })
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
      await sequelizeUserService.create({ entity: deleted })
    }
    const users = await sequelizeUserService.getAllDeleted()
    assert.ok(users)
    assert.strictEqual(users.length > 2, true)
  })

  await it('sequelize - should restore user', async () => {
    const restored = await sequelizeUserService.restore({ id: user.id })
    const foundUser = await sequelizeUserService.getById({ id: user.id })
    assert.ok(restored)
    assert.strictEqual(foundUser?.isDeleted, false)
    assert.strictEqual(foundUser?.firstName, user.firstName)
  })

  await it('sequelize - should hard delete user', async () => {
    const hard = await sequelizeUserService.hardDelete({ id: user.id })
    const foundUser = await sequelizeUserService.getById({ id: user.id })
    assert.ok(hard)
    assert.strictEqual(foundUser, null)
  })
}).catch((err) => {
  console.log(err)
})

const uri =
  'mongodb://localhost:27017/?readPreference=primary&ssl=false&directConnection=true'

describe('Typegoose Tests', async () => {
  connect(uri, {
    dbName: 'test'
  })
    .then(() => {
      console.log('Mongo db connected🍃')
    })
    .catch((err) => {
      throw new Error(`Test: Unable to connect to mongodb ${err}`)
    })

  const typegooseUserService = new TypegooseUserService()
  let user: Typegoose
  await it('typegoose - should create user', async () => {
    const createdUser = await typegooseUserService.create({
      entity
    })
    assert.ok(createdUser)
    user = createdUser
    assert.strictEqual(createdUser.firstName, 'John')
  })

  await it('typegoose - should get all users', async () => {
    const foundUser = await typegooseUserService.getAll()
    assert.ok(foundUser)
  })

  await it('typegoose - should get user by id', async () => {
    const foundUser = await typegooseUserService.getById({
      id: String(user._id)
    })
    assert.ok(foundUser)
    assert.strictEqual(foundUser.firstName, user.firstName)
  })

  await it('typegoose - should update user', async () => {
    const updatedUser = await typegooseUserService.update({
      entity: { firstName: 'Jane' },
      id: String(user._id)
    })
    if (updatedUser) {
      user = updatedUser
    }
    const foundUser = await typegooseUserService.getById({
      id: String(user._id)
    })
    assert.ok(updatedUser)
    assert.strictEqual(foundUser.firstName, updatedUser.firstName)
  })

  await it('typegoose - should soft delete user', async () => {
    const soft = await typegooseUserService.softDelete({
      id: String(user._id)
    })
    const foundUser = await typegooseUserService.getById({
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
      await typegooseUserService.create({
        entity: deleted
      })
    }
    const users = await typegooseUserService.getAllDeleted()
    assert.ok(users)
    assert.strictEqual(users.length > 2, true)
  })

  await it('typegoose - should restore user', async () => {
    const restored = await typegooseUserService.restore({
      id: String(user._id)
    })
    const foundUser = await typegooseUserService.getById({
      id: String(user._id)
    })
    assert.ok(restored)
    assert.strictEqual(foundUser.isDeleted, false)
    assert.strictEqual(foundUser.firstName, user.firstName)
  })

  await it('typegoose - should hard delete user', async () => {
    const hard = await typegooseUserService.hardDelete({
      id: String(user._id)
    })
    assert.ok(hard)
  })
}).catch(() => {
  console.log('error')
}).finally(() => {
  setTimeout(() => {
    process.exit()
  }, 1000)
})
