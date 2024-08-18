// commonFunctions.js
import { toast } from "react-toastify";


 const getPort = () => {
  // get the host name
  const hostname = window.location.hostname;
  let portValue = 3000;
  return `http://${hostname}:${portValue}`;
  // return `https://flexcap.onrender.com`;
};

const showToast = (message, type) => {
  return (toast[type](message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  }));
};


export { getPort, showToast };