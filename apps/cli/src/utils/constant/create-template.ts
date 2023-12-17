import { type PathLike, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

interface TemplateOptions {
  dir: PathLike
  name: string
  content: string
  ext: 'js' | 'ts'
  category: 'service' | 'controller' | 'model'
}

/**
 * Creates a template.
 *
 * @param options - The options for creating a template.
 * @param options.dir - The directory path to create the template. Default is `src/${category}` which could be model, service, controller.
 * @param options.name - The name for creating a template.
 */
export function createTemplate ({ dir, name, content, ext, category }: TemplateOptions): void {
  const dirPath = `${dir.toString()}`
  mkdirSync(dirPath, { recursive: true })
  const filePath = join(dirPath, `${name}.${category}.${ext}`)

  writeFileSync(filePath, content, 'utf8')
}
