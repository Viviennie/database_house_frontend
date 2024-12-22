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
    limit: 30  // 限制返回结果数量
  };

  console.log('图数据库查询参数:', JSON.stringify(formattedQuery, null, 2));

  // 测试数据
  const mockData = {
    results: [
      {
        name: "图数据库测试电影1",
        releaseDate: "2024-01-30",
        score: 4.7
      },
      {
        name: "图数据库测试电影2",
        releaseDate: "2024-02-28",
        score: 4.9
      }
    ],
    performance: 80,
    log: "图数据库查询日志:\n查询开始时间: 2024-01-20 10:30:00\n查询结束时间: 2024-01-20 10:30:00.080"
  };

  return Promise.resolve({ data: mockData });
  
  // 实际的 API 调用（暂时注释）
  // return graphClient.post('/search', formattedQuery);
};

export const fetchActorCooperation = (actor1, actor2) => {
  const params = { actor1, actor2 };
  console.log('图数据库查询参数:', JSON.stringify(params, null, 2));

  // 测试数据
  const mockData = {
    results: [
      {
        "ACTOR_NAME1": actor1,
        "COOPERATION_COUNT": 10,
        "ACTOR_NAME2": actor2
      }
    ],
    performance: 10,
    log: "图数据库查询日志:\n演员合作查询开始时间: 2024-01-20 10:30:00\n查询结束时间: 2024-01-20 10:30:00.080"
  };

  return Promise.resolve({ data: mockData });

  // 实际的 API 调用（暂时注释）
  // return graphClient.get('/actor_actor', { params });
};

export const fetchFavoriteActors = (params) => {
  console.log('图数据库查询参数:', JSON.stringify(params, null, 2));

  // 测试数据
  const mockData = {
    results: [
      {
        "actor_names": "Actor G, Actor H, Actor I",
        "movie_name": `${params.style}类型电影5`
      },
      {
        "actor_names": "Actor P, Actor Q, Actor R",
        "movie_name": `${params.style}类型电影6`
      }
    ],
    performance: 30,
    log: "图数据库查询日志:\n演员组合条件查询开始时间: 2024-01-20 10:30:00\n查询结束时间: 2024-01-20 10:30:00.060"
  };

  return Promise.resolve({ data: mockData });

  // 实际的 API 调用（暂时注释）
  // return graphClient.get('/query_favorite', { params });
};

export const fetchDirectorActorCooperation = (director, actor) => {
  const params = { director, actor };
  console.log('图数据库查询参数:', JSON.stringify(params, null, 2));

  // 测试数据
  const mockData = {
    results: [
      {
        "ACTOR_NAME": actor,
        "COOPERATION_COUNT": 9,
        "DIRECTOR_NAME": director
      }
    ],
    performance: 40,
    log: "图数据库查询日志:\n导演演员合作查询开始时间: 2024-01-20 10:30:00\n查询结束时间: 2024-01-20 10:30:00.070"
  };

  return Promise.resolve({ data: mockData });
  
  // 实际的 API 调用（暂时注释）
  // return graphClient.get('/actor_director', { params });
};

export const fetchGraphTrace = (queryForm) => {
  console.log('图数据库溯源查询参数:', JSON.stringify(queryForm, null, 2));

  // 测试数据
  const mockData = {
    results: [
      {
        "actor": [
          {
            "asin": ["B07FDKRJQC"],
            "name": "Robert Downey Jr."
          },
          {
            "asin": ["B07FDKRJQC"],
            "name": "Chris Evans"
          }
        ],
        "asin": ["B07FDKRJQC"],
        "director": [
          {
            "asin": ["B07FDKRJQC"],
            "name": "Anthony Russo"
          },
          {
            "asin": ["B07FDKRJQC"],
            "name": "Joe Russo"
          }
        ],
        "id": 27707,
        "movie_name": "Avengers: Infinity War",
        "time": "2018-04-27",
        "timehistroy": "网页",
        "timesource": "B07FDKRJQC",
        "version": [
          {
            "asin": ["B07FDKRJQC"],
            "name": "4K Ultra HD"
          }
        ]
      }
    ]
  };

  return Promise.resolve({ data: mockData });
  
  // 实际的 API 调用（暂时注释）
  // return graphClient.post('/trace', queryForm);
}; 