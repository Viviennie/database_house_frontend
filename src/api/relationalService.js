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
    limit: 30  // 限制返回结果数量
  };

  console.log('关系型数据仓库查询参数:', JSON.stringify(formattedQuery, null, 2));

  // 测试数据
  const mockData = {
    results: [
      {
        name: "关系型测试电影1",
        releaseDate: "2024-01-15",
        score: 4.2
      },
      {
        name: "关系型测试电影2",
        releaseDate: "2024-02-15",
        score: 4.6
      }
    ],
    performance: 100,
    log: "关系型数据仓库查询日志:\n查询开始时间: 2024-01-20 10:30:00\n查询结束时间: 2024-01-20 10:30:00.100"
  };

  return Promise.resolve({ data: mockData });
  
  // 实际的 API 调用（暂时注释）
  // return relationalClient.post('/search', formattedQuery);
}; 

export const fetchActorCooperation = (actor1, actor2) => {
  const params = { actor1, actor2 };
  console.log('关系型数据仓库查询参数:', JSON.stringify(params, null, 2));

  // 测试数据
  const mockData = {
    results: [
      {
        "ACTOR_NAME1": actor1,
        "COOPERATION_COUNT": 8,
        "ACTOR_NAME2": actor2
      }
    ],
    performance: 100,
    log: "关系型数据仓库查询日志:\n演员合作查询开始时间: 2024-01-20 10:30:00\n查询结束时间: 2024-01-20 10:30:00.100"
  };

  return Promise.resolve({ data: mockData });

  // 实际的 API 调用（暂时注释）
  // return relationalClient.get('/actor_actor', { params });
};

export const fetchFavoriteActors = (params) => {
  console.log('关系型数据仓库查询参数:', JSON.stringify(params, null, 2));

  // 测试数据
  const mockData = {
    results: [
      {
        "actor_names": "Actor D, Actor E, Actor F",
        "movie_name": `${params.style}类型电影3`
      },
      {
        "actor_names": "Actor M, Actor N, Actor O",
        "movie_name": `${params.style}类型电影4`
      }
    ],
    performance: 90,
    log: "关系型数据仓库查询日志:\n演员组合条件查询开始时间: 2024-01-20 10:30:00\n查询结束时间: 2024-01-20 10:30:00.120"
  };

  return Promise.resolve({ data: mockData });

  // 实际的 API 调用（暂时注释）
  // return relationalClient.get('/query_favorite', { params });
};

export const fetchDirectorActorCooperation = (director, actor) => {
  const params = { director, actor };
  console.log('关系型数据仓库查询参数:', JSON.stringify(params, null, 2));

  // 测试数据
  const mockData = {
    results: [
      {
        "ACTOR_NAME": actor,
        "COOPERATION_COUNT": 6,
        "DIRECTOR_NAME": director
      }
    ],
    performance: 10,
    log: "关系型数据仓库查询日志:\n导演演员合作查询开始时间: 2024-01-20 10:30:00\n查询结束时间: 2024-01-20 10:30:00.090"
  };

  return Promise.resolve({ data: mockData });
  
  // 实际的 API 调用（暂时注释）
  // return relationalClient.get('/actor_director', { params });
}; 