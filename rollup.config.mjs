import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import css from 'rollup-plugin-import-css';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy'

export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'iife'
  },
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    terser(),
    css(),
    nodeResolve(),
    commonjs(),
    copy({
      targets: [
        { src: 'src/index.html', dest: 'dist' },
        { src: 'src/index.css', dest: 'dist' },
        { src: 'src/webfonts', dest: 'dist' }
      ]
    })
  ]
}