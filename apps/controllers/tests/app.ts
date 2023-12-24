import express, { json, urlencoded } from 'express'
import type { Application } from 'express'
import { sequelizeRouter, sequelize } from './sequelize'
import { typegooseRouter, connection } from './typegoose'

const app: Application = express()

app.use(json())
app.use(urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello World')
})
app.use('/api/sequelize', sequelizeRouter)
app.use('/api/typegoose', typegooseRouter)

async function handleConnection (): Promise<void> {
  try {
    await Promise.all([
      connection(),
      sequelize.sync({ alter: true })
    ])
  } catch (err) {
    console.error(`Unable to connect to the database: ${err}`)
  }
}

await handleConnection()

const port = 4000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
export { app, handleConnection }
