import axios from 'axios'
const axiosI = axios.create({baseURL:"https://todo-backend-4qap.onrender.com"})
axiosI.interceptors.request.use(function (config) {
    let jwtToken = JSON.parse(localStorage.getItem('jwdAuth') )
    const token = jwtToken && jwtToken.token ? jwtToken.token : 0
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
  
export default axiosI 