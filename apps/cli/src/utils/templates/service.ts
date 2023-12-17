import { capitalizeFirstLetter } from '../constant'
interface ServiceTemplateOptions {
  name: string
}

export function SequelizeServiceTemplate ({ name }: ServiceTemplateOptions): string {
  name = capitalizeFirstLetter(name)
  return `import { ${name}Model } from '@/models'
import { SequelizeService } from '@gnx-utilities/core'

export class ${name}Service extends SequelizeService<${name}> {
  constructor () {
    super(${name})
  }
}`
}

export function TypegooseServiceTemplate ({ name }: ServiceTemplateOptions): string {
  name = capitalizeFirstLetter(name)
  return `import { ${name}Model } from '@/models'
import { TypegooseService } from '@gnx-utilities/core'

export class ${name}Service extends TypegooseService<${name}> {
  constructor () {
    super(${name})
  }
}`
}
