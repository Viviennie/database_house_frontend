import axios from 'axios';

const relationalClient = axios.create({
  baseURL: 'http://100.80.147.34:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchRelationalData = (queryForm) => {
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

  //console.log('关系型数据库查询参数:', JSON.stringify(formattedQuery, null, 2));
  const queryString = new URLSearchParams(formattedQuery).toString();

  // 执行 GET 请求，将查询字符串附加到 URL 中
  return relationalClient.get(`/query_movie?${queryString}`);
}; 