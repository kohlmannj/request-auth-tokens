const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const json = require('rollup-plugin-json');
const commonjs = require('rollup-plugin-commonjs');
const pkg = require('./package.json');

module.exports = {
  dest: 'lib/index.js',
  entry: 'src/index.js',
  format: 'cjs',
  external: [
    'caller',
    'lodash.merge',
    'open',
    'react',
    'react-dom',
    'express',
    'request',
    'server-destroy',
    'urlencode',
  ],
  plugins: [
    json(),
    babel({
      exclude: ['node_modules/**'],
    }),
    resolve(),
    // commonjs(),
  ],
  sourceMap: true,
};
