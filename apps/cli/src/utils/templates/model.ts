import { capitalizeFirstLetter } from '../constant'
interface ServiceTemplateOptions {
  name: string
}

export function SequelizeModelTemplate ({ name }: ServiceTemplateOptions): string {
  name = capitalizeFirstLetter(name)
  return `import { SequelizeBaseEntity } from '@gnx-utilities/models';\nimport { DataTypes } from 'sequelize';\nimport { sequelize } from 'database';\nexport class ${name} extends SequelizeBaseEntity {\n}\n\n${name}.init(\n  {\n    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }\n  },\n  { sequelize, modelName: '${name}' }\n)\n`
}

export function TypegooseModelTemplate ({ name }: ServiceTemplateOptions): string {
  name = capitalizeFirstLetter(name)
  return `import { getModelForClass, prop } from '@typegoose/typegoose';\nimport { TypegooseBaseEntity } from '@gnx-utilities/models';\n\nexport class ${name} extends TypegooseBaseEntity {\n  @prop({ type: String })\n  declare firstName: string;\n\n  @prop({ type: String })\n  declare lastName: string;\n}\n\nexport const ${name}Model = getModelForClass(${name});\n`
}
