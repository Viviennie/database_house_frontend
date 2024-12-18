import axios from 'axios';

const distributedClient = axios.create({
  baseURL: 'http://distributed-backend-url', // 分布式数据仓库的后端 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchDistributedData = (queryForm) => {
  return distributedClient.post('/search', queryForm);
}; 