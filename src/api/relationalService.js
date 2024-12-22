import axios from 'axios';

const relationalClient = axios.create({
  baseURL: 'http://100.80.147.34:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');  // 月份从0开始，需加1
  const day = String(date.getDate()).padStart(2, '0');         // 补齐日期

  return `${year}-${month}-${day}`;  // 格式化为 YYYY-MM-DD
}
export const fetchRelationalData = (queryForm) => {
  const formattedQuery = {
    moviename: queryForm.name,
    startTime: formatDate(queryForm.releaseDate[0]),
    endTime: formatDate(queryForm.releaseDate[1]), 
    version: queryForm.version,
    director: queryForm.directors,
    actor: queryForm.actors,
    style: queryForm.style,
    percent: queryForm.positiveRate,
    lowscore: queryForm.score[0],
    highscore: queryForm.score[1],
    limit: queryForm.limit || 100, // 默认限制为 100
  };

  //console.log('关系型数据库查询参数:', JSON.stringify(formattedQuery, null, 2));
  const queryString = new URLSearchParams(formattedQuery).toString();

  // 执行 GET 请求，将查询字符串附加到 URL 中
  return relationalClient.get(`/query_movie?${queryString}`);
}; 
export const traceRelationalData = (p) => {
  // 执行 GET 请求，将查询字符串附加到 URL 中
  const q={
    movie_name: p.value
  }
  const queryString = new URLSearchParams(q).toString();
  return relationalClient.get(`/traceability?${queryString}`);
}; 

// 查询经常合作的演员组合（关系型数据库）
export const fetchCooperatingActorsFromRelational = (params) => {
  // 将查询参数转换为 URLSearchParams
  const queryString = new URLSearchParams(params).toString();
  return relationalClient.get(`/actor_actor?${queryString}`);
}

// 查询经常合作的导演和演员组合（关系型数据库）
export const fetchCooperatingDirectorActorFromRelational = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return relationalClient.get(`/actor_director?${queryString}`);
}

// 查询最受关注的演员组合（关系型数据库）
export const fetchMostPopularActorsFromRelational = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return relationalClient.get(`/query_favorite?${queryString}`);
}