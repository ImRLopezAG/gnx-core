import assert from 'node:assert'
import { describe, it } from 'node:test'
import request from 'supertest'
import { app } from './app'

const entity = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@testing.test'
} as const

const withId = {
  ...entity,
  id: ''
}

await describe('start', async () => {
  await it('should return 200', async () => {
    const response = await request(app).get('/')
    assert.strictEqual(response.status, 200)
  })
})

await describe('Sequelize Tests', async () => {
  await it('sequelize #create -Create Entity', async () => {
    const response = await request(app).post('/api/sequelize/create').send(entity).expect(201)
    withId.id = response.body.data.id
    assert.ok(response.body.data)
    assert.strictEqual(response.body.data.firstName, entity.firstName)
  })

  await it('sequelize #createMany - Create Many Entities', async () => {
    const response = await request(app).post('/api/sequelize/createMany').send({ data: Array(5).fill(entity) }).expect(201)
    assert.ok(response.body.data)
    assert.strictEqual(response.body.data.length >= 5, true)
  })

  await it('sequelize #getAll - Get Entities', async () => {
    const response = await request(app).get('/api/sequelize/list').expect(200)
    assert.ok(response.body.data)
    assert.ok(response.body.data.length >= 1)
  })

  await it('sequelize #getById - Get Entity By Id', async () => {
    const response = await request(app).get(`/api/sequelize/get/${withId.id}`).expect(200)
    assert.ok(response.body.data)

    assert.strictEqual(response.body.data.firstName, entity.firstName)
  })

  await it('sequelize #update - Update Entity', async () => {
    const updatedEntity = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'updated@test.testing'
    }
    const response = await request(app).patch(`/api/sequelize/update/${withId.id}`).send(updatedEntity).expect(200)

    assert.ok(response.body.data)
    assert.strictEqual(response.body.data.email, updatedEntity.email)
  })

  await it('sequelize #softDelete - Delete Entity', async () => {
    const response = await request(app).delete(`/api/sequelize/hide/${withId.id}`).expect(200)
    assert.ok(response.body.data)
    assert.strictEqual(response.body.data, true)
  })

  await it('sequelize #restore - Restore Entity', async () => {
    const response = await request(app).patch(`/api/sequelize/restore/${withId.id}`).expect(200)

    assert.ok(response.body.data)
    assert.strictEqual(response.body.data, true)
  })

  await it('sequelize #hardDelete - Delete Entity', async () => {
    const response = await request(app).delete(`/api/sequelize/delete/${withId.id}`).expect(200)
    assert.ok(response.body.data)
    assert.strictEqual(response.body.data, true)
  })

  await it('sequelize #getPaginated - Get Paginated Entities', async () => {
    const response = await request(app).get('/api/sequelize/paginate?limit=2').expect(200)
    assert.ok(response.body.data)
    assert.strictEqual(response.body.data.totalPages >= 2, true)
  })

  await it('sequelize #getAllDeleted - Get Deleted Entities', async () => {
    const deleted = {
      ...entity,
      isDeleted: true
    }
    await request(app).post('/api/sequelize/createMany').send({ data: Array(5).fill(deleted) }).expect(201)
    const response = await request(app).get('/api/sequelize/deleted').expect(200)
    assert.ok(response.body.data)
    assert.ok(response.body.data.length >= 1)
    assert.strictEqual(response.body.data.every((item: any) => item.isDeleted), true)
  })

  await it('sequelize #getAllWithDeleted - Get All Entities', async () => {
    const response = await request(app).get('/api/sequelize/all').expect(200)
    assert.ok(response.body.data)
    assert.ok(response.body.data.length >= 1)
  })

  await it('sequelize #empty - Delete All Entities', async () => {
    const response = await request(app).delete('/api/sequelize/deleteAll').send().expect(200)
    assert.ok(response.body.data)
  })
})

await describe('Typegoose Tests', async () => {
  await it('typegoose #create - Create Entity', async () => {
    const response = await request(app).post('/api/typegoose/create').send(entity).expect(201)
    withId.id = response.body.data._id
    assert.ok(response.body.data)
    assert.strictEqual(response.body.data.firstName, entity.firstName)
  })

  await it('typegoose #createMany - Create Many Entities', async () => {
    const response = await request(app).post('/api/typegoose/createMany').send({ data: Array(5).fill(entity) }).expect(201)
    assert.ok(response.body.data)
    assert.strictEqual(response.body.data.length >= 5, true)
  })

  await it('typegoose #getAll - Get Entities', async () => {
    const response = await request(app).get('/api/typegoose/list').expect(200)
    assert.ok(response.body.data)
    assert.ok(response.body.data.length >= 1)
  })

  await it('typegoose #getById - Get Entity By Id', async () => {
    const response = await request(app).get(`/api/typegoose/get/${withId.id}`).expect(200)
    assert.ok(response.body.data)
    assert.strictEqual(response.body.data.firstName, entity.firstName)
  })

  await it('typegoose #update - Update Entity', async () => {
    const updatedEntity = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'typegoose@test.test'
    }
    const response = await request(app).patch(`/api/typegoose/update/${withId.id}`).send(updatedEntity).expect(200)
    assert.ok(response.body.data)
    assert.strictEqual(response.body.data.email, updatedEntity.email)
  })

  await it('typegoose #softDelete - Delete Entity', async () => {
    const response = await request(app).delete(`/api/typegoose/hide/${withId.id}`).expect(200)
    assert.ok(response.body.data)
    assert.strictEqual(response.body.data, true)
  })

  await it('typegoose #restore - Restore Entity', async () => {
    const response = await request(app).patch(`/api/typegoose/restore/${withId.id}`).expect(200)

    assert.ok(response.body.data)
    assert.strictEqual(response.body.data, true)
  })

  await it('typegoose #hardDelete - Delete Entity', async () => {
    const response = await request(app).delete(`/api/typegoose/delete/${withId.id}`).expect(200)
    assert.ok(response.body.data)
    assert.strictEqual(response.body.data, true)
  })

  await it('typegoose #getPaginated - Get Paginated Entities', async () => {
    const response = await request(app).get('/api/typegoose/paginate?limit=2').expect(200)
    assert.ok(response.body.data)
    assert.strictEqual(response.body.data.totalPages >= 2, true)
  })

  await it('typegoose #getAllDeleted - Get Deleted Entities', async () => {
    const deleted = {
      ...entity,
      isDeleted: true
    }
    await request(app).post('/api/typegoose/createMany').send({ data: Array(5).fill(deleted) }).expect(201)
    const response = await request(app).get('/api/typegoose/deleted').expect(200)

    assert.ok(response.body.data)
    assert.ok(response.body.data.length >= 1)
    assert.strictEqual(response.body.data.every((item: any) => item.isDeleted), true)
  })

  await it('typegoose #getAllWithDeleted - Get All Entities', async () => {
    const response = await request(app).get('/api/typegoose/all').expect(200)
    assert.ok(response.body.data)
    assert.ok(response.body.data.length >= 1)
    assert.strictEqual(response.body.data.some((item: any) => item.isDeleted), true)
  })

  await it('typegoose #empty - Delete All Entities', async () => {
    const response = await request(app).delete('/api/typegoose/deleteAll').send().expect(200)
    assert.ok(response.body.data)
  })
}).finally(() => {
  setTimeout(() => {
    process.exit()
  }, 1000)
})
