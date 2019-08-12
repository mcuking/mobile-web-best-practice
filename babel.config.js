module.exports = {
  plugins: [
    [
      "import",
      {
        libraryName: "vant",
        libraryDirectory: "es",
        style: name => `${name}/style/less`
      },
      "vant"
    ],
    [
      "try-catch-error-report",
      {
        expression: "window.$sentry.log",
        needFilename: true,
        needLineNo: true,
        needColumnNo: false,
        needContext: true,
        exclude: ["node_modules"]
      }
    ]
  ],
  presets: ["@vue/app"]
};
