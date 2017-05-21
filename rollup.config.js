const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const json = require('rollup-plugin-json');
const commonjs = require('rollup-plugin-commonjs');
const pkg = require('./package.json');

module.exports = {
  dest: 'lib/index.js',
  entry: 'src/index.js',
  format: 'cjs',
  external: Object.keys(pkg.dependencies),
  plugins: [
    json(),
    babel({
      env: {
        development: {
          sourceMaps: true,
        },
        production: {
          plugins: ['transform-react-remove-prop-types'],
        },
      },
      plugins: ['external-helpers', 'transform-class-properties'],
      presets: [
        [
          'env',
          {
            modules: false,
            targets: {
              node: '6.10',
            },
          },
        ],
        'stage-2',
      ],
      babelrc: false,
      exclude: ['node_modules/**'],
    }),
    commonjs(),
    resolve({
      module: false,
      jsnext: false,
    }),
  ],
};
