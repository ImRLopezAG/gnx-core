import { capitalizeFirstLetter } from '../constant'
interface ServiceTemplateOptions {
  name: string
}

export function SequelizeServiceTemplateTS ({ name }: ServiceTemplateOptions): string {
  name = capitalizeFirstLetter(name)
  return `import { ${name}Model, ${name} } from '@/models'\nimport { SequelizeService } from '@gnx-utilities/core'\n\nexport class ${name}Service extends SequelizeService<${name}> {\n  constructor () {\n    super(${name})\n  }\n}\n`
}

export function SequelizeServiceTemplateJS ({ name }: ServiceTemplateOptions): string {
  name = capitalizeFirstLetter(name)
  return `import { ${name}Model } from '@/models'\nimport { SequelizeService } from '@gnx-utilities/core'\n\nexport class ${name}Service extends SequelizeService {\n  constructor () {\n    super(${name})\n  }\n}\n`
}

export function TypegooseServiceTemplateTS ({ name }: ServiceTemplateOptions): string {
  name = capitalizeFirstLetter(name)
  return `import { ${name}Model, ${name}  } from '@/models'\nimport { TypegooseService } from '@gnx-utilities/core'\n\nexport class ${name}Service extends TypegooseService<${name}> {\n  constructor () {\n    super(${name})\n  }\n}\n`
}
