import axios from 'axios';

// Create a central API client
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Connects to your running backend
});

export default api;