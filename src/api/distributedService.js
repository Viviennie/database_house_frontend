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
    limit: queryForm.limit || 100, // 默认限制为 100
  };
  
  console.log('分布式数据仓库查询参数:', JSON.stringify(formattedQuery, null, 2));
  return distributedClient.get('/query_movie', {
    params: formattedQuery
  });
}; 
export const traceRelationalData = (p) => {
  // 执行 GET 请求，将查询字符串附加到 URL 中
  const q={
    movie_name: p.value
  }
  const queryString = new URLSearchParams(q).toString();
  return distributedClient.get(`/traceability?${queryString}`);
}; 

// 查询经常合作的演员组合
export const fetchCooperatingActorsFromDistributed = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return distributedClient.get(`/actor_actor?${queryString}`);
}

// 查询经常合作的导演和演员组合
export const fetchCooperatingDirectorActorFromDistributed = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return  distributedClient.get(`/actor_director?${queryString}`);
}

// 查询最受关注的演员组合
export const fetchMostPopularActorsFromDistributed = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return  distributedClient.get(`/query_favorite?${queryString}`);
}