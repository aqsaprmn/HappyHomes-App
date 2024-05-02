import axios from "axios";

const Instance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
  timeout: 1000 * 60,
  validateStatus: (status) => {
    return status >= 200 && status < 500;
  },
});

Instance.interceptors.request.use(
  (config) => config,
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);

Instance.interceptors.response.use(
  (res) => res,
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default Instance;
