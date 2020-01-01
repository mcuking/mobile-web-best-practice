// 此文件用于在 less-loader 编译 less 到 css 过程中修改 vant 组件库定义的 less 变量
// vant 组件库全部 less 变量请见 ./src/less/vant-var.less

const modifyVars = {
  'button-primary-background-color': '#1989fa',
  'button-primary-border-color': '#1989fa',
  'nav-bar-height': '56px',
  'nav-bar-arrow-size': '18px',
  'nav-bar-icon-color': '#323233',
  'nav-bar-text-color': '#323233'
};

module.exports = modifyVars;
