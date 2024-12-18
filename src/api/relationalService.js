import axios from 'axios';

const relationalClient = axios.create({
  baseURL: 'http://relational-backend-url', // 关系型数据仓库的后端 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchRelationalData = (queryForm) => {
  return relationalClient.post('/search', queryForm);
}; 