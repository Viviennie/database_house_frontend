<template>
  <div class="trace-container">
    <el-card class="trace-form">
      <template #header>
        <div class="card-header">
          <span>电影溯源</span>
        </div>
      </template>
      
      <el-form :model="traceForm" label-width="120px" v-show="!showDetail">
        <el-form-item label="电影名称">
          <el-input v-model="traceForm.name" placeholder="请输入电影名称" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleTrace">溯源查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div v-if="showResults" class="results-container">
      <el-radio-group
       v-show="!showDetail"
       v-model="selectedDatabase" class="database-selector">
        <el-radio-button label="all">所有结果</el-radio-button>
        <el-radio-button label="distributed">分布式数据仓库</el-radio-button>
        <el-radio-button label="relational">关系型数据仓库</el-radio-button>
        <el-radio-button label="graph">图数据仓库</el-radio-button>
      </el-radio-group>

      <el-card v-if="!showDetail" class="result-list" :transition="true">
        <template #header>
          <div class="card-header">
            <span>溯源结果</span>
          </div>
        </template>
        <el-table :data="filteredResults" style="width: 100%">
          <el-table-column prop="movie_name" label="电影名称" />
          <el-table-column prop="id" label="电影ID" />
          <el-table-column prop="time" label="时间" />
          <el-table-column label="演员" :formatter="formatActors" />
          <el-table-column label="导演" :formatter="formatDirectors" />
          <el-table-column label="版本" :formatter="formatVersions" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary" link @click="showMovieDetail(scope.row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card v-else class="detail-card" :transition="true">
        <template #header>
          <div class="card-header">
            <el-button type="primary" link @click="showDetail = false">
              返回列表
            </el-button>
            <span>电影详情</span>
          </div>
        </template>
        <div class="detail-content">
          <h3>{{ selectedMovie.movie_name }}</h3>
          <p>ID: {{ selectedMovie.id }}</p>
          <p>时间: {{ selectedMovie.time }}</p>
          <p>ASIN: 
            <template v-for="(asin, index) in selectedMovie.asin" :key="index">
              <a :href="formatAmazonUrl(asin)" target="_blank">{{ formatAmazonUrl(asin) }}</a>
              <span v-if="index < selectedMovie.asin.length - 1">, </span>
            </template>
          </p>
          
          <div class="detail-section">
            <h4>演员信息</h4>
            <el-table :data="selectedMovie.actor" style="width: 100%">
              <el-table-column prop="name" label="演员名称" />
              <el-table-column label="ASIN" #default="{ row }">
                <template v-for="(asin, index) in row.asin" :key="index">
                  <a :href="formatAmazonUrl(asin)" target="_blank">{{ formatAmazonUrl(asin) }}</a>
                  <span v-if="index < row.asin.length - 1">, </span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="detail-section">
            <h4>导演信息</h4>
            <el-table :data="selectedMovie.director" style="width: 100%">
              <el-table-column prop="name" label="导演名称" />
              <el-table-column label="ASIN" #default="{ row }">
                <template v-for="(asin, index) in row.asin" :key="index">
                  <a :href="formatAmazonUrl(asin)" target="_blank">{{ formatAmazonUrl(asin) }}</a>
                  <span v-if="index < row.asin.length - 1">, </span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="detail-section">
            <h4>版本信息</h4>
            <el-table :data="selectedMovie.version" style="width: 100%">
              <el-table-column prop="name" label="版本名称" />
              <el-table-column label="ASIN" #default="{ row }">
                <template v-for="(asin, index) in row.asin" :key="index">
                  <a :href="formatAmazonUrl(asin)" target="_blank">{{ formatAmazonUrl(asin) }}</a>
                  <span v-if="index < row.asin.length - 1">, </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

import { fetchDistributedTrace } from '../api/distributedService'
import { fetchRelationalTrace } from '../api/relationalService'
import { fetchGraphTrace } from '../api/graphService'

const traceForm = reactive({
  name: ''
})

const showResults = ref(false)
const showDetail = ref(false)
const selectedDatabase = ref('all')
const selectedMovie = ref(null)
const traceResults = ref([])

const databaseResults = reactive({
  distributed: [],
  relational: [],
  graph: []
})

const formatActors = (row) => row.actor.map(a => a.name).join(', ')
const formatDirectors = (row) => row.director.map(d => d.name).join(', ')
const formatVersions = (row) => row.version.map(v => v.name).join(', ')

const filteredResults = computed(() => {
  if (selectedDatabase.value === 'all') {
    return traceResults.value
  }
  return databaseResults[selectedDatabase.value]
})

const showMovieDetail = (movie) => {
  selectedMovie.value = movie
  showDetail.value = true
}

const handleTrace = async () => {
  try {
    const [distributedResponse, relationalResponse, graphResponse] = await Promise.all([
      fetchDistributedTrace(traceForm),
      fetchRelationalTrace(traceForm),
      fetchGraphTrace(traceForm)
    ])

    databaseResults.distributed = distributedResponse.data.results
    databaseResults.relational = relationalResponse.data.results
    databaseResults.graph = graphResponse.data.results

    traceResults.value = [
      ...distributedResponse.data.results,
      ...relationalResponse.data.results,
      ...graphResponse.data.results
    ]

    showResults.value = true
  } catch (error) {
    console.error('溯源查询失败:', error)
  }
}

// 添加亚马逊链接格式化函数
const formatAmazonUrl = (asin) => `http://amazon.com/dp/${asin}`
</script>

<style scoped>
.trace-container {
  padding: 80px 20px 20px;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
}

.trace-form {
  margin-bottom: 20px;
}

.card-header {
  font-weight: bold;
}

.detail-card {
  width: 100%;
}

.detail-content {
  padding: 20px;
}

.detail-section {
  margin: 20px 0;
}

.detail-section h4 {
  margin-bottom: 10px;
}

/* 添加过渡动画样式 */
.result-list,
.detail-card {
  transition: all 0.2s ease; 
}

/* 添加链接样式 */
a {
  color: #409EFF;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

</style> 