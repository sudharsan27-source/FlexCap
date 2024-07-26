// commonFunctions.js
export const getPort = () => {
  // get the host name
  const hostname = window.location.hostname;
  let portValue = 3000;
  return `http://${hostname}:${portValue}`;
};
