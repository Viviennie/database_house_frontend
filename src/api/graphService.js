import axios from 'axios';

const graphClient = axios.create({
  baseURL: 'http://graph-backend-url', // 图数据库的后端 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchGraphData = (queryForm) => {
  return graphClient.post('/search', queryForm);
}; 