import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { importAssertionsPlugin } from 'rollup-plugin-import-assert'

export default [
  {
    input: 'index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named'
    },
    plugins: [
      json(),
      commonjs(),
      importAssertionsPlugin()
    ],
    external: [
      'assert',
      'fs',
      'nearley',
      'randexp'
    ]
  }
]
