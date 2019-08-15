export const sleep = (duration: number) =>
  new Promise((resolve) => void setTimeout(resolve, duration));
