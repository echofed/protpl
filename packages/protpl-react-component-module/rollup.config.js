// rollup.config.js
import typescript from 'typescript'
import rollupTypescript from 'rollup-plugin-typescript'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import uglify from 'rollup-plugin-uglify'

import {
  name,
  version,
  author
} from './package.json'

const dev = 'development'
const prod = 'production'

function parseNodeEnv(nodeEnv) {
  if (nodeEnv === prod || nodeEnv === dev) {
    return nodeEnv
  }
  return dev
}

const nodeEnv = parseNodeEnv(process.env.NODE_ENV)
const exampleBasicPath = './example/'
const exampleBundle = exampleBasicPath + `/${name}.js`
const port = 3005
const banner =
  `${'/*!\n' + ' * '}${name}.js v${version}\n` +
  ` * (c) 2018-${new Date().getFullYear()} ${author}\n` +
  ` * Released under the MIT License.\n` +
  ` */`
const plugins = [
  replace({
    // The react sources include a reference to process.env.NODE_ENV so we need to replace it here with the actual value
    'process.env.NODE_ENV': JSON.stringify(nodeEnv)
  }),
  rollupTypescript({ typescript, importHelpers: true })
]

const pluginsExample = plugins.concat([
  // nodeResolve makes rollup look for dependencies in the node_modules directory
  nodeResolve({
    browser: true
  }),
  commonjs({
    // All of our own sources will be ES6 modules, so only node_modules need to be resolved with cjs
    include: 'node_modules/**',
    namedExports: {
      // The commonjs plugin can't figure out the exports of some modules, so if rollup gives warnings like:
      // ⚠️   'render' is not exported by 'node_modules/react-dom/index.js'
      // Just add the mentioned file / export here
      'node_modules/react-dom/index.js': ['render'],
      'node_modules/react-is/index.js': ['isElement', 'isValidElementType','ForwardRef'],
      'node_modules/react/index.js': ['Component', 'createContext', 'PropTypes', 'createElement', 'cloneElement']
    }
  })
])

if (nodeEnv === dev) {
  // For playing around with just frontend code the serve plugin is pretty nice.
  // We removed it when we started doing actual backend work.
  pluginsExample.push(
    serve({
      contentBase: './example/',
      port,
      historyApiFallback: true,
      open: true
    })
  )
  pluginsExample.push(livereload({
    watch: exampleBundle
  }))
}

if (nodeEnv === prod) {
  plugins.push(uglify())
}

export default [
  {
    input: 'src/index.tsx',
    output: [{
      file: `dist/${name}.js`,
      format: 'umd',
      name,
      banner,
      extend: true
    },
    //esm version
    {
      file: `dist/${name}.esm.js`,
      format: 'es',
      banner,
      extend: true
    }],
    watch: {
      include: './src/**'
    },
    plugins
  },
  {
    input: exampleBasicPath + 'index.tsx',
    output: {
      file: exampleBundle,
      format: 'iife',
      name,
      extend: true
    },
    watch: {
      include: ['./src/**', exampleBasicPath + '**']
    },
    plugins: pluginsExample
  }
]
