export const getProductInfo = () => {
  return fetch("/data.json").then((v) => {
    return new Promise((res) => {
      setTimeout(() => {
        res(v.json());
      }, 500);
    });
  });
};
