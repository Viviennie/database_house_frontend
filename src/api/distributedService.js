import axios from 'axios';

const distributedClient = axios.create({
  baseURL: 'http://192.168.32.129:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchDistributedData = (queryForm) => {
  const formattedQuery = {
    moviename: queryForm.name,
    startTime: queryForm.releaseDate[0],
    endTime: queryForm.releaseDate[1], 
    version: queryForm.version,
    director: queryForm.directors,
    actor: queryForm.actors,
    style: queryForm.style,
    percent: queryForm.positiveRate,
    lowscore: queryForm.score[0],
    highscore: queryForm.score[1],
    limit: queryForm.limit  // 限制返回结果数量
  };
  
  console.log('分布式数据仓库查询参数:', JSON.stringify(formattedQuery, null, 2));
  return distributedClient.get('/search', {
    params: formattedQuery
  });
}; 