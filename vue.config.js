const webpack = require("webpack");
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_DEV = NODE_ENV === "development";

module.exports = {
  outputDir: `dist/`,
  productionSourceMap: !IS_DEV,
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          green: "#000",
          "button-primary-background-color": "#1989fa",
          "button-primary-border-color": "#1989fa"
        }
      }
    }
  },
  configureWebpack: {
    entry: `./src/main.ts`,
    output: {
      libraryExport: "default"
    },
    externals: {
      vue: "Vue"
    }
  }
};
