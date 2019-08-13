const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_DEV = NODE_ENV === 'development';

const plugins = [
  [
    'import',
    {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: name => `${name}/style/less`
    },
    'vant'
  ]
];

if (!IS_DEV) {
  plugins.push([
    'try-catch-error-report',
    {
      expression: 'window.$sentry.log',
      needFilename: true,
      needLineNo: true,
      needColumnNo: false,
      needContext: true,
      exclude: ['node_modules']
    }
  ]);
}

module.exports = {
  plugins,
  presets: ['@vue/app']
};
