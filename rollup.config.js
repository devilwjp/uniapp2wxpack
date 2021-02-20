/* eslint-disable prefer-object-spread/prefer-object-spread */

import resolve from '@rollup/plugin-node-resolve'
// import babel from 'rollup-plugin-babel'
import json from '@rollup/plugin-json'
// import {uglify} from 'rollup-plugin-uglify'
import commonjs from '@rollup/plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import {terser} from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'


function killCommonjsRequire () {
  return {
      name: 'killCommonjsRequire',
      transform(code) {
          return code.replace('throw new Error(\'Dynamic requires are not currently supported by @rollup/plugin-commonjs\')', 'return require.apply(null, arguments)')
              .replace(`throw new Error('Could not dynamically require "' + target + '". Please configure the dynamicRequireTargets option of @rollup/plugin-commonjs appropriately for this require call to behave properly.')`, 'return require.apply(null, arguments)')
      },
  }
}

const shared = {
  input: 'src/gulpCore/index.js',
  plugins: [
    builtins(),
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      }
    }),
    commonjs({
        include: ['src/**']
    }),
    json(),
    // node脚本的打包不需要处理动态依赖，rollup也不支持动态依赖，所以自定义一个rollup插件处理
    killCommonjsRequire(),
    // babel({
    //     exclude: 'node_modules/**',
    // }),
    replace({
        'process.env.BABEL_ENV': JSON.stringify('rollup')
    }),
    terser({
      toplevel: true,
      mangle: {
          toplevel: true
      },
      compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true
      }
    })
  ],
  external: ['path', 'parse5', 'gulp', 'del', 'gulp-load-plugins', 'fs-extra', 'strip-json-comments', 'gulp-strip-comments', 'single-line-log', 'commander', 'child_process', 'single-line-log', 'postcss-comment', 'htmlparser2', 'preprocess', 'vue-template-compiler', 'chokidar', 'vinyl', 'shorthash2', 'acorn-globals', 'escodegen', 'getmac'],
}

export default [
    Object.assign({}, {
        ...shared,
        input: 'src/lib/index.js'
    }, {
        output: {
            file: 'dist/lib/index.js',
            format: 'cjs',
            exports: 'named'
        },
    }),
    Object.assign({}, shared, {
        output: {
            file: 'dist/gulpfile.js',
            format: 'cjs',
            exports: 'named'
        },
    }),
]
