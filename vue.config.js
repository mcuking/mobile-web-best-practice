const webpack = require("webpack");
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_DEV = NODE_ENV === "development";

module.exports = {
  css: { extract: false },
  outputDir: `dist/`,
  productionSourceMap: !IS_DEV,
  configureWebpack: {
    entry: `./src/main.ts`,
    output: {
      libraryExport: "default"
    },
    externals: {
      vue: "Vue",
      vant: "vant"
    },
    plugins: {}
  }
};
