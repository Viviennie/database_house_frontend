import axios from 'axios';

const distributedClient = axios.create({
  baseURL: 'http://192.168.32.129:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchDistributedData = (queryForm) => {
  const formattedQuery = {
    name: queryForm.name,
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
  //console.log('发送的分布式参数:', JSON.stringify(formattedQuery, null, 2));
  return distributedClient.get('/search', {
    params: formattedQuery
  });
}; 

export const fetchDistributedTrace = (traceForm) => {
  const formattedQuery = {
    moviename: traceForm.name,
    limit: traceForm.limit  // 限制返回结果数量
  };
  
  return distributedClient.get('/genre', {
    params: formattedQuery
  });
}; 

export const fetchMostPopularActorsFromDistributed = (queryForm) => {
  const formattedQuery = {
    style: queryForm.style,
    num: queryForm.num,
    limit: queryForm.limit  // 限制演员组合数量
  };
  
  return distributedClient.get('/query_favorite', {
    params: formattedQuery
  });
}; 

export const fetchCooperatingDirectorActorFromDistributed = (queryForm) => {
  const formattedQuery = {
    limit: queryForm.limit  // 限制返回结果数量
  };
  
  return distributedClient.get('/director_actor', {
    params: formattedQuery
  });
}; 

export const fetchCooperatingActorsFromDistributed = (queryForm) => {
  //console.log('进入分布式查询参数:', JSON.stringify(queryForm, null, 2));

  const formattedQuery = {
    limit: queryForm.limit  // 限制返回结果数量
  };
  
  return distributedClient.get('/actor_actor', {
    params: formattedQuery
  });
}; 