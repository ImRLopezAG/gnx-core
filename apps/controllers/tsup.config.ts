import { type Format, defineConfig } from 'tsup'

const isDev = process.env.npm_lifecycle_event === 'test'
const format: Format[] = isDev ? ['esm'] : ['esm', 'cjs']
const entry = isDev ? ['tests/index.test.ts'] : ['src/index.ts']

export default defineConfig({
  clean: true,
  entry,
  format,
  minify: !isDev,
  target: 'esnext',
  outDir: isDev ? 'dist' : 'lib',
  keepNames: isDev,
  dts: !isDev,
  minifySyntax: true,
  splitting: false,
  sourcemap: false,
  minifyIdentifiers: true,
  skipNodeModulesBundle: true
})
