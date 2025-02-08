import { defineConfig } from 'vite'
import dtsPlugin from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dtsPlugin({
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'livjs',
      fileName: 'livjs'
    }
  }
})
