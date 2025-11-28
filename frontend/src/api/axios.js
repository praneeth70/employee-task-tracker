// frontend/src/api/axios.js

import axios from 'axios';

const api = axios.create({
  // *** THIS IS THE LIVE, PRODUCTION API URL ***
  baseURL: 'https://employee-task-tracker-f0gp.onrender.com/api', 
});

export default api;