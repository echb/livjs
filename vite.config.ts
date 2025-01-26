import { defineConfig } from 'vite'
import dtsPlugin from 'vite-plugin-dts'
import oxlintPlugin from 'vite-plugin-oxlint'

export default defineConfig({
  plugins: [
    oxlintPlugin(),
    dtsPlugin({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'livjs',
      fileName: 'livjs',
    },
  },
})
