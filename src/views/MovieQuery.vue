<template>
  <div class="query-container">
    <el-card class="query-form">
      <template #header>
        <div class="card-header">
          <span>电影查询</span>
        </div>
      </template>
      
      <el-form :model="queryForm" label-width="120px">
        <el-form-item label="电影名称">
          <el-input v-model="queryForm.name" placeholder="请输入电影名称" />
        </el-form-item>
        
        <el-form-item label="上映时间">
          <el-date-picker
            v-model="queryForm.releaseDate"
            type="daterange"
            range-separator="——"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        
        <el-form-item label="电影版本">
          <el-input v-model="queryForm.version" placeholder="请输入电影版本" />
        </el-form-item>
        
        <el-form-item label="导演">
          <el-input v-model="queryForm.director" placeholder="请输入导演姓名" />
        </el-form-item>
        
        <el-form-item label="演员">
          <el-input v-model="queryForm.actors" placeholder="请输入演员姓名" />
        </el-form-item>
        
        <el-form-item label="好评百分比">
          <el-slider
            v-model="queryForm.positiveRate"
            :step="1"
            :max="100"
          />
        </el-form-item>
        
        <el-form-item label="电影总分">
          <el-input-number
            v-model="queryForm.totalScore[0]"
            :step="0.1"
            :max="5"
            :min="0"
            controls-position="right"
            placeholder="最低分"
            @change="validateScoreRange"
          />
          <span style="margin: 0 10px;">至</span>
          <el-input-number
            v-model="queryForm.totalScore[1]"
            :step="0.1"
            :max="5"
            :min="0"
            controls-position="right"
            placeholder="最高分"
            @change="validateScoreRange"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 查询结果展示 -->
    <div v-if="showResults" class="results-container">
      <el-card class="result-list">
        <template #header>
          <div class="card-header">
            <span>查询结果</span>
          </div>
        </template>
        <el-table :data="searchResults" style="width: 100%">
          <el-table-column prop="name" label="电影名称" />
          <el-table-column prop="releaseDate" label="上映时间" />
          <el-table-column prop="movieId" label="电影ID" />
        </el-table>
      </el-card>

      <el-card class="performance-chart">
        <template #header>
          <div class="card-header">
            <span>性能比较</span>
            <el-button type="text" @click="toggleLogs" style="float: right;">点击查看日志</el-button>
          </div>
        </template>
        <div ref="chartRef" style="height: 400px"></div>
      </el-card>

      <el-card v-if="showLogs" class="logs-card">
        <template #header>
          <div class="card-header" label-width="120px">
            <span>查询日志</span>
          </div>
        </template>
        <div v-for="(log, index) in paginatedLogs" :key="index" class="log-entry">
          <pre>{{ log }}</pre>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="logs.length"
          :page-size="1"
          @current-change="handlePageChange"
        />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import * as echarts from 'echarts'
import { fetchDistributedData } from '../api/distributedService'
import { fetchRelationalData } from '../api/relationalService'
import { fetchGraphData } from '../api/graphService'

const queryForm = reactive({
  name: '',
  releaseDate: [],
  version: '',
  director: '',
  actors: '',
  positiveRate: 50,
  totalScore: [0, 5]
})

const showResults = ref(false)
const searchResults = ref([])
const chartRef = ref(null)
let chart = null
const showLogs = ref(false)
const logs = ref([])
const currentPage = ref(1)

const validateScoreRange = () => {
  if (queryForm.totalScore[1] < queryForm.totalScore[0]) {
    queryForm.totalScore[1] = queryForm.totalScore[0]
  }
}

const handleSubmit = async () => {
  validateScoreRange()
  
  try {
    const [distributedResponse, relationalResponse, graphResponse] = await Promise.all([
      fetchDistributedData(queryForm),
      fetchRelationalData(queryForm),
      fetchGraphData(queryForm),
    ])

    searchResults.value = [
      ...distributedResponse.data.results,
      ...relationalResponse.data.results,
      ...graphResponse.data.results,
    ]

    updateChart([
      distributedResponse.data.performance,
      relationalResponse.data.performance,
      graphResponse.data.performance,
    ])

    logs.value = [
      distributedResponse.data.log,
      relationalResponse.data.log,
      graphResponse.data.log,
    ].map(log => log.split('\n\n').map(entry => entry.replace(/\\n/g, '\n')))

    showResults.value = true
  } catch (error) {
    console.error('查询失败:', error)
    // ElMessage.error('查询失败，请稍后重试')
  }
}

const toggleLogs = () => {
  showLogs.value = !showLogs.value
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const paginatedLogs = computed(() => {
  const start = currentPage.value - 1
  return logs.value[start] || []
})

const updateChart = (performanceData) => {
  if (!chart) {
    chart = echarts.init(chartRef.value)
  }
  
  const option = {
    title: {
      text: '数据仓库查询性能比较'
    },
    tooltip: {},
    xAxis: {
      data: ['分布式数据仓库', '关系型数据仓库', '图数据仓库']
    },
    yAxis: {
      name: '查询时间(ms)'
    },
    series: [{
      name: '查询时间',
      type: 'bar',
      data: performanceData
    }]
  }
  
  chart.setOption(option)
}

onMounted(async () => {
  window.addEventListener('resize', () => {
    chart?.resize()
  })

  // 读取 log.txt 文件内容
  try {
    const response = await fetch('/src/assets/log.txt')
    const text = await response.text()
    logs.value = text.split('\n\n').map(log => log.replace(/\\n/g, '\n')) // 将日志内容按双换行分割为数组，并替换 \n 为换行
  } catch (error) {
    console.error('无法读取日志文件:', error)
  }
})
</script>

<style scoped>
.query-container {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  background-color: var(--background-color);
  min-height: calc(100vh - 60px);
  margin-top: 60px;

}

.query-form {
  width: 90%; /* 修改这里，增加表单宽度 */
  max-width: 1400px; /* 增加最大宽度 */
  margin: 0 auto 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.form-content {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 22px;
}

.form-footer {
  text-align: center;
  margin-top: 30px;
}

.results-container {
  width: 90%; /* 修这里，增加结果区域宽度 */
  max-width: 1400px; /* 增加最大宽度 */
  margin: 0 auto;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
}

.logs-card {
  margin-top: 20px;
  width: 90%; /* 修改这里，增加表单宽度 */
  width: 1400px; /* 增加最大宽度 */
  margin: 0 auto 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.log-entry {
  padding: 10px;
  border-bottom: 1px solid #e8e8e8;
}

.card-header {
  font-weight: bold;
}

@media (max-width: 768px) {
  .query-container {
    padding: 10px;
  }
  
  .query-form,
  .results-container {
    width: 95%; 
  }
  
  .results-container {
    grid-template-columns: 1fr;
  }
}
</style> 