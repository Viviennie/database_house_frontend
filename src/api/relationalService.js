import axios from 'axios';

const relationalClient = axios.create({
  baseURL: 'http://127.0.0.1:4523/m1/5525003-0-default/api/relational-backend-url',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchRelationalData = (queryForm) => {
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

  console.log('关系型数据仓库查询参数:', JSON.stringify(formattedQuery, null, 2));
  return relationalClient.post('/search', formattedQuery);
}; 