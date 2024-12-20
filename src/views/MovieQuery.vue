<template>
  <div class="query-container" v-loading="loading">
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
          <el-input v-model="queryForm.directors" placeholder="请输入导演姓名" />
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
            v-model="queryForm.score[0]"
            :step="0.1"
            :max="5"
            :min="0"
            controls-position="right"
            placeholder="最低分"
            @change="validateScoreRange"
          />
          <span style="margin: 0 10px;">至</span>
          <el-input-number
            v-model="queryForm.score[1]"
            :step="0.1"
            :max="5"
            :min="0"
            controls-position="right"
            placeholder="最高分"
            @change="validateScoreRange"
          />
        </el-form-item>
        <el-form-item label="结果显示数量">
          <el-input-number
            v-model="queryForm.limit"
            :step="50"
            controls-position="right"
            placeholder="最高分"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 查询结果展示 -->
    <div v-if=true class="results-container">
      <el-card class="result-list">
        <template #header>
          <div class="card-header">
            <span>查询结果</span>
          </div>
        </template>
        <el-tabs >
          <el-tab-pane label="分布式数据库的结果">
            <el-table :data="dr" style="width: 100%; height: 600px;">
              <el-table-column prop="movie_name" label="电影名字" />
              <el-table-column prop="movie_release_time" label="电影上映时间"  />
              <el-table-column prop="movie_score" label="电影评分"  :formatter="formatScore" />
            </el-table>
            <el-row >
              <el-col :span="24">
                <div>结果总数：{{ len[0]}}</div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="关系数据库的结果">
            <el-table :data="rr" style="width: 100%; height: 600px;">
              <el-table-column prop="movie_name" label="电影名字" />
              <el-table-column prop="movie_release_time" label="电影上映时间"  />
              <el-table-column prop="movie_score" label="电影评分"  :formatter="formatScore" />
            </el-table>
            <el-row >
              <el-col :span="24">
                <div>结果总数：{{ len[1] }}</div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="图数据库的结果">
            <el-table :data="gr" style="width: 100%; height: 600px;">
              <el-table-column prop="movie_name" label="电影名字" />
              <el-table-column prop="movie_release_time" label="电影上映时间"  />
              <el-table-column prop="movie_score" label="电影评分"  :formatter="formatScore" />
            </el-table>
            <el-row >
              <el-col :span="24">
                <div>结果总数：{{ len[2] }}</div>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <el-card class="performance-chart">
        <template #header>
          <div class="card-header">
            <span>性能比较</span>
          </div>
        </template>
        <div ref="chartRef" style="height: 400px"></div>
      </el-card>

      <el-card v-if=true class="logs-card">
        <template #header>
          <div class="card-header" label-width="120px">
            <span>查询日志</span>
          </div>
        </template>
        <el-tabs >
          <el-tab-pane label="分布式数据库的日志">
            <div style="max-width: 100%;overflow-x: auto;">
              <pre>{{fenbulog}}</pre>
            </div>
          </el-tab-pane>
          <el-tab-pane label="图数据库的日志">
            <div style="max-width: 100%;overflow-x: auto;">
              <pre>{{ graphlog }}</pre>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted} from 'vue'
import * as echarts from 'echarts'
import { fetchDistributedData } from '../api/distributedService'
import { fetchRelationalData } from '../api/relationalService'
import { fetchGraphData } from '../api/graphService'
import {ElMessage } from 'element-plus'

const queryForm = reactive({
  name: '',
  releaseDate: ['2000-1-1','2010-1-1'],
  version: '',
  directors: '',
  actors: '',
  style: '',
  positiveRate: 50,
  score: [0, 5],
  limit:50
})
let loading=ref(false)
const chartRef = ref(null)
let chart = null
const fenbulog=ref("暂无日志")
const graphlog=ref("暂无日志")
const rr=ref([])
const dr=ref([])
const gr=ref([])
const len=ref([0,0,0])

const validateScoreRange = () => {
  if (queryForm.score[1] < queryForm.score[0]) {
    queryForm.score[1] = queryForm.score[0]
  }
}

const handleSubmit = async () => {
  validateScoreRange()
  let relationalResponse = null
  let distributedResponse = null
  let graphResponse = null
  let a=0
  let b=0
  let c=0
  rr.value=[]
  dr.value=[]
  gr.value=[]
  graphlog.value=""
  fenbulog.value=""
  loading.value=true
  try {
    relationalResponse =await fetchRelationalData(queryForm)
  } catch (error) {
    ElMessage({message:'关系型数据库查询失败',type: 'error'})
  }
  try {
     distributedResponse= await fetchDistributedData(queryForm)
  } catch (error) {
    ElMessage({message:'分布式查询失败',type: 'error'})
  }
  try {
    graphResponse =await fetchGraphData(queryForm)
  } catch (error) {
    ElMessage({message:'图数据库查询失败',type: 'error'})
    // ElMessage.error('查询失败，请稍后重试')
  }
  if (distributedResponse && distributedResponse.data ) {
    a=distributedResponse.data.time
    dr.value =distributedResponse.data.results
    fenbulog.value=distributedResponse.data.report
    len.value[0]=distributedResponse.data.num
    ElMessage({message:"分布式数据库查询成功",type: 'success'})
  }

  if (relationalResponse && relationalResponse.data ) {
    b=relationalResponse.data.time
    rr.value =relationalResponse.data.results
    len.value[1]=relationalResponse.data.len
    ElMessage({message:"关系型数据库查询成功",type: 'success'})
  }

  if (graphResponse && graphResponse.data ) {
    c=graphResponse.data.time
    gr.value =graphResponse.data.results
    graphlog.value=graphResponse.data.report
    len.value[2]=graphResponse.data.num
    ElMessage({message: '图数据库查询成功',type: 'success'})
  }
  updateChart([
     a,b,c,
  ])
  loading.value=false
}

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

onMounted(() => {
  window.addEventListener('resize', () => {
    chart?.resize()
  })
})

function formatScore(row, column, cellValue) {
    return cellValue ? cellValue.toFixed(2) : '-';
  }
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