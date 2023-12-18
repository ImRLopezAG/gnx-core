import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  entry: ['apps/index.ts'],
  format: ['cjs', 'esm'],
  minify: true,
  target: 'esnext',
  outDir: 'lib',
  dts: true,
  keepNames: true,
  minifySyntax: true,
  external: ['pg-hstore'],
  sourcemap: true
})
