export const sleep = (duration: number) =>
  new Promise((resolve) => void setTimeout(resolve, duration));

export const initPlatform = () => {
  window.$platform = /MWBPContainer\/android+/.test(navigator.userAgent)
    ? 'android'
    : /MWBPContainer\/ios+/.test(navigator.userAgent)
    ? 'ios'
    : 'browser';
};
