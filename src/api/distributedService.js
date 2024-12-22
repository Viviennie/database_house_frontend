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

  // 测试数据
  const mockData = {
    results: [
      {
        name: "测试电影1",
        releaseDate: "2024-01-01",
        score: 4.5
      },
      {
        name: "测试电影2",
        releaseDate: "2024-02-01",
        score: 4.8
      }
    ],
    performance: 150,
    log: "分布式数据仓库查询日志:\n查询开始时间: 2024-01-20 10:30:00\n查询结束时间: 2024-01-20 10:30:00.150"
  };

  return Promise.resolve({ data: mockData });
  
  // 实际的 API 调用（暂时注释）
  // return distributedClient.post('/search', formattedQuery);
}; 

export const fetchActorCooperation = (actor1, actor2) => {
  const params = { actor1, actor2 };
  console.log('分布式数据仓库查询参数:', JSON.stringify(params, null, 2));

  // 测试数据
  const mockData = {
    results: [
      {
        "ACTOR_NAME1": actor1,
        "COOPERATION_COUNT": 5,
        "ACTOR_NAME2": actor2
      }
    ],
    performance: 70,
    log: "分布式数据仓库查询日志:\n演员合作查询开始时间: 2024-01-20 10:30:00\n查询结束时间: 2024-01-20 10:30:00.150"
  };

  return Promise.resolve({ data: mockData });

  // 实际的 API 调用（暂时注释）
  // return distributedClient.get('/actor_actor', { params });
};

export const fetchFavoriteActors = (params) => {
  console.log('分布式数据仓库查询参数:', JSON.stringify(params, null, 2));

  // 测试数据
  const mockData = {
    results: [
      {
        "actor_names": "Actor A, Actor B, Actor C",
        "movie_name": `${params.style}类型电影1`
      },
      {
        "actor_names": "Actor X, Actor Y, Actor Z",
        "movie_name": `${params.style}类型电影2`
      }
    ],
    performance: 20,
    log: "分布式数据仓库查询日志:\n演员组合条件查询开始时间: 2024-01-20 10:30:00\n查询结束时间: 2024-01-20 10:30:00.180"
  };

  return Promise.resolve({ data: mockData });

  // 实际的 API 调用（暂时注释）
  // return distributedClient.get('/query_favorite', { params });
};

export const fetchDirectorActorCooperation = (director, actor) => {
  const params = { director, actor };
  console.log('分布式数据仓库查询参数:', JSON.stringify(params, null, 2));

  // 测试数据
  const mockData = {
    results: [
      {
        "ACTOR_NAME": actor,
        "COOPERATION_COUNT": 3,
        "DIRECTOR_NAME": director
      }
    ],
    performance: 10,
    log: "分布式数据仓库查询日志:\n导演演员合作查询开始时间: 2024-01-20 10:30:00\n查询结束时间: 2024-01-20 10:30:00.130"
  };

  return Promise.resolve({ data: mockData });
  
  // 实际的 API 调用（暂时注释）
  // return distributedClient.get('/actor_director', { params });
}; 