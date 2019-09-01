const LocalConfig = require('./src/config.json');
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRO = NODE_ENV === 'production';

const plugins = [
  ['lodash'],
  [
    'import',
    {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: (name) => `${name}/style/less`
    },
    'vant'
  ]
];

if (LocalConfig.SentryEnabled && IS_PRO) {
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
