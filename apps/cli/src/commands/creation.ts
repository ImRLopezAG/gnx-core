import inquirer from 'inquirer'
import chalk from 'chalk'

import {
  SequelizeModelTemplate,
  SequelizeServiceTemplate,
  TypegooseModelTemplate,
  TypegooseServiceTemplate,
  createTemplate
} from '../utils/'

interface ServiceOptions {
  dir: string
  name: string
  category: 'service' | 'model' | 'controller'
  ext: 'ts' | 'js'
  template: 'sequelize' | 'typegoose'
}

type Content = Omit<ServiceOptions, 'dir' | 'ext'>
type Creation = Omit<ServiceOptions, 'template' | 'category'>

export async function creation ({ name, dir, ext }: Creation): Promise<void> {
  await inquirer
    .prompt([
      {
        type: 'list',
        name: 'category',
        message: 'Select template category:',
        choices: ['service', 'model', 'controller'],
        default: 'service'
      },
      {
        type: 'list',
        name: 'template',
        message: 'Select template category:',
        choices: ['sequelize', 'typegoose'],
        default: 'Sequelize',
        when: (answers: ServiceOptions) => ['service', 'model'].includes(answers.category)
      },
      {
        type: 'input',
        name: 'dir',
        message: 'Enter dir path: ',
        default: (answers: ServiceOptions) => {
          return `src/${answers.category}s`
        }
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter template name: ',
        default: 'user'
      },
      {
        type: 'list',
        name: 'ext',
        message: 'Select template type:',
        choices: ['ts', 'js'],
        default: 'ts',
        when: (answers: ServiceOptions) => ['sequelize'].includes(answers.template)
      }
    ], {
      name, dir, ext
    })
    .then(({ category, dir, name, ext, template }) => {
      if (category === 'controller') {
        console.log(chalk.red('controller template is not supported yet'))
        return
      }
      createTemplate({
        name,
        dir,
        category,
        ext: ext ?? 'ts',
        content: getContent({ name, template, category })
      })
      console.log(chalk.green(`Template created successfully: ${dir}/${name}.${category}.${ext || 'ts'}`))
    })
    .catch((error) => {
      console.log(chalk.red(error))
      process.exit(1)
    })
}

function getContent ({ category, name, template }: Content): string {
  const categories = {
    service: {
      typegoose: TypegooseServiceTemplate({ name }),
      sequelize: SequelizeServiceTemplate({ name })
    },
    model: {
      typegoose: TypegooseModelTemplate({ name }),
      sequelize: SequelizeModelTemplate({ name })
    }
  }

  return categories[category][template]
}
