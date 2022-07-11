import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;
if (baseUrl) {
  axios.defaults.baseURL = baseUrl;
}
