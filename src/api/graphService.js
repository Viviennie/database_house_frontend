import axios from 'axios';

const graphClient = axios.create({
  baseURL: 'http://127.0.0.1:4523/m1/5525003-0-default/api/graph-backend-url',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchGraphData = (queryForm) => {
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
    limit: 10  // 限制返回结果数量
  };

  console.log('图数据库查询参数:', JSON.stringify(formattedQuery, null, 2));
  return graphClient.post('/search', formattedQuery);
}; 