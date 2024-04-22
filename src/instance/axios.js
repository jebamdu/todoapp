import axios from 'axios'
const axiosI = axios.create({baseURL:"http://localhost:4000"})
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