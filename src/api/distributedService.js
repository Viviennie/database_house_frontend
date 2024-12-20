import axios from 'axios';

const distributedClient = axios.create({
  baseURL: 'http://127.0.0.1:4523/m1/5525003-0-default/api/distributed-backend-url',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchDistributedData = (queryForm) => {
  // 转换日期格式并确保数据是普通对象
  const formattedQuery = {
    name: queryForm.name,
    releaseDate: queryForm.releaseDate.map(date => 
      date ? date.toISOString().split('T')[0] : null
    ),
    version: queryForm.version,
    directors: queryForm.directors,
    actors: queryForm.actors,
    style: queryForm.style,
    positiveRate: queryForm.positiveRate,
    score: Array.from(queryForm.score),
    limit: 30  // 限制返回结果数量
  };
  
  console.log('分布式数据仓库查询参数:', JSON.stringify(formattedQuery, null, 2));
  return distributedClient.post('/search', formattedQuery);
}; 