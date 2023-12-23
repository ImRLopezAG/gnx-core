import { type Format, defineConfig } from 'tsup'

const isDev = process.env.npm_lifecycle_event === 'gnx' || process.env.npm_lifecycle_event === 'dev'
const format: Format[] = isDev ? ['esm'] : ['esm', 'cjs']

export default defineConfig({
  clean: true,
  entry: ['src/index.ts'],
  format,
  minify: true,
  target: 'esnext',
  outDir: isDev ? 'dist' : 'lib',
  dts: isDev ? undefined : true,
  keepNames: true,
  minifySyntax: true,
  splitting: false,
  sourcemap: false,
  minifyIdentifiers: true,
  skipNodeModulesBundle: true
})
