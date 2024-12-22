import axios from 'axios';

const graphClient = axios.create({
  baseURL: 'http://100.80.131.231:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchGraphData = (queryForm) => {
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

  //console.log('图数据库查询参数:', JSON.stringify(formattedQuery, null, 2));
  const queryString = new URLSearchParams(formattedQuery).toString();

  // 执行 GET 请求，将查询字符串附加到 URL 中
  return graphClient.get(`/fullsearch?${queryString}`);
}; 
export const traceGraphData = (p) => {
  // 执行 GET 请求，将查询字符串附加到 URL 中
  const q={
    movie_name: p.value
  }
  const queryString = new URLSearchParams(q).toString();
  return graphClient.get(`/datatrace?${queryString}`);
}; 

// 查询经常合作的演员组合（关系型数据库）
export const fetchCooperatingActorsFromGraph = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return graphClient.get(`/actor_actor?${queryString}`);
}
// 查询经常合作的导演和演员组合（关系型数据库）
export const fetchCooperatingDirectorActorFromGraph = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return graphClient.get(`/actor_director?${queryString}`);
}

// 查询最受关注的演员组合（关系型数据库）
export const fetchMostPopularActorsFromGraph = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return graphClient.get(`/query_favorite?${queryString}`);
}