import { capitalizeFirstLetter } from '../constant'
interface ServiceTemplateOptions {
  name: string
}

export function SequelizeModelTemplate ({ name }: ServiceTemplateOptions): string {
  name = capitalizeFirstLetter(name)
  return `import { SequelizeBaseEntity } from '@gnx-utilities/models'
import { DataTypes } from 'sequelize'
import { sequelize } from 'database'
export class ${name} extends SequelizeBaseEntity {
}

${name}.init(
  {
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
  },
  { sequelize, modelName: ${name} }
)
`
}

export function TypegooseModelTemplate ({ name }: ServiceTemplateOptions): string {
  name = capitalizeFirstLetter(name)
  return `import { getModelForClass, prop } from '@typegoose/typegoose'
import { TypegooseBaseEntity } from '@gnx-utilities/models'

export class ${name} extends TypegooseBaseEntity {
  @prop({ type: String })
  declare firstName: string

  @prop({ type: String })
  declare lastName: string
}

export const ${name}Model = getModelForClass(${name})
`
}
