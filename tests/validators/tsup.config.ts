import { type Format, defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  entry: ['index.test.ts'],
  format: ['esm'],
  minify: true,
  target: 'esnext',
  outDir: 'dist',
  dts: false,
  keepNames: true,
  minifySyntax: true,
  splitting: false,
  sourcemap: false,
  minifyIdentifiers: true,
  skipNodeModulesBundle: true
})
