<template>
  <div class="query-container">
    <!-- 查询类型选择按钮 -->
    <div class="query-type-buttons">
      <el-radio-group v-model="queryType">
        <el-radio-button label="movie">电影查询</el-radio-button>
        <el-radio-button label="actor">演员组合查询</el-radio-button>
        <el-radio-button label="actorDirector">导演&演员组合查询</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 电影查询表单 -->
    <el-card v-if="queryType === 'movie'" class="query-form">
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
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 演员组合查询表单 -->
    <el-card v-if="queryType === 'actor'" class="query-form">
      <template #header>
        <div class="card-header">
          <span>演员组合查询</span>
        </div>
      </template>
      
      <el-form :model="actorQueryForm" label-width="120px">
        <el-form-item>
          <el-radio-group v-model="actorQueryType">
            <el-radio label="direct">直接查询</el-radio>
            <el-radio label="conditional">条件查询</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--直接查询表单-->
        <template v-if="actorQueryType === 'direct'">
          <text>演员组合的合作次数查询</text>
          <el-form-item label="演员A名称">
            <el-input v-model="actorQueryForm.actor1" placeholder="请输入演员A姓名" />
          </el-form-item>
          <el-form-item label="演员B名称">
            <el-input v-model="actorQueryForm.actor2" placeholder="请输入演员B姓名" />
          </el-form-item>
        </template>
        <!-- 条件查询表单 -->
        <template v-if="actorQueryType === 'conditional'">
          <text>xx类电影最受关注演员组合查询</text>
          <el-form-item label="电影类型">
            <el-input v-model="actorConditionalQueryForm.style" placeholder="请输入电影类型" />
          </el-form-item>
          
          <el-form-item label="查询电影数量">
            <el-input-number v-model="actorConditionalQueryForm.num" :min="1" :max="100" />
          </el-form-item>
          
          <el-form-item label="演员数量限制">
            <el-input-number v-model="actorConditionalQueryForm.limit" :min="2" :max="10" />
          </el-form-item>
        </template>

        <el-form-item>
          <el-button type="primary" @click="handleActorQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 导演&演员组合查询表单 -->
    <el-card v-if="queryType === 'actorDirector'" class="query-form">
      <template #header>
        <div class="card-header">
          <span>导演&演员组合查询</span>
        </div>
      </template>
      
      <el-form :model="actorDirectorForm" label-width="120px">
        <el-form-item label="导演名称">
          <el-input v-model="actorDirectorForm.director" placeholder="请输入导演名称" />
        </el-form-item>
        
        <el-form-item label="演员名称">
          <el-input v-model="actorDirectorForm.actor" placeholder="请输入演员名称" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleActorDirectorQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 查询结果展示 -->
    <div v-if="showResults" class="results-container">
      <!-- 数据库选择按钮 -->
      <el-radio-group v-model="selectedDatabase" class="database-selector">
        <el-radio-button label="all">所有结果</el-radio-button>
        <el-radio-button label="distributed">分布式数据仓库</el-radio-button>
        <el-radio-button label="relational">关系型数据仓库</el-radio-button>
        <el-radio-button label="graph">图数据仓库</el-radio-button>
      </el-radio-group>

      <!-- 电影查询结果 -->
      <el-card v-if="queryType === 'movie'" class="result-list">
        <template #header>
          <div class="card-header">
            <span>查询结果</span>
          </div>
        </template>
        <el-table :data="filteredResults" style="width: 100%">
          <el-table-column prop="name" label="电影名称" />
          <el-table-column prop="releaseDate" label="上映时间" />
          <el-table-column prop="score" label="评分" />
        </el-table>
      </el-card>

      <!-- 演员组合查询结果 -->
      <el-card v-if="queryType === 'actor'" class="result-list">
        <template #header>
          <div class="card-header">
            <span>演员组合查询结果</span>
          </div>
        </template>
        <el-table v-if="actorQueryType === 'direct'" :data="filteredActorResults" style="width: 100%">
          <el-table-column prop="ACTOR_NAME1" label="演员1" />
          <el-table-column prop="ACTOR_NAME2" label="演员2" />
          <el-table-column prop="COOPERATION_COUNT" label="合作次数" />
        </el-table>
        <el-table v-else :data="filteredActorResults" style="width: 100%">
          <el-table-column prop="movie_name" label="电影名称" />
          <el-table-column prop="actor_names" label="演员组合" />
        </el-table>
      </el-card>

      <!-- 导演&演员组合查询结果 -->
      <el-card v-if="queryType === 'actorDirector'" class="result-list">
        <template #header>
          <div class="card-header">
            <span>导演&演员组合查询结果</span>
          </div>
        </template>
        <el-table :data="filteredActorDirectorResults" style="width: 100%">
          <el-table-column prop="DIRECTOR_NAME" label="导演" />
          <el-table-column prop="ACTOR_NAME" label="演员" />
          <el-table-column prop="COOPERATION_COUNT" label="合作次数" />
        </el-table>
      </el-card>

      <el-card class="performance-chart">
        <template #header>
          <div class="card-header">
            <span>性能比较</span>
            <el-button type="primary" link @click="toggleLogs">点击查看日志</el-button>
          </div>
        </template>
        <div ref="chartRef" class="chart-container" style="width: 100%; height: 400px;"></div>
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
import { ref, reactive, onMounted, computed, onUnmounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import { 
  fetchGraphData, 
  fetchActorCooperation as fetchGraphActorCooperation, 
  fetchFavoriteActors as fetchGraphFavoriteActors,
  fetchDirectorActorCooperation as fetchGraphDirectorActorCooperation 
} from '../api/graphService'
import { 
  fetchDistributedData,
  fetchActorCooperation as fetchDistributedActorCooperation,
  fetchFavoriteActors as fetchDistributedFavoriteActors,
  fetchDirectorActorCooperation as fetchDistributedDirectorActorCooperation
} from '../api/distributedService'
import { 
  fetchRelationalData,
  fetchActorCooperation as fetchRelationalActorCooperation,
  fetchFavoriteActors as fetchRelationalFavoriteActors,
  fetchDirectorActorCooperation as fetchRelationalDirectorActorCooperation
} from '../api/relationalService'

const queryForm = reactive({
  name: '',
  releaseDate: [],
  version: '',
  directors: '',
  actors: '',
  style: '',
  positiveRate: 50,
  score: [0, 5]
})

const showResults = ref(false)
const searchResults = ref([])
const chartRef = ref(null)
let chart = null
const showLogs = ref(false)
const logs = ref([])
const currentPage = ref(1)

// 查询类型
const queryType = ref('movie')
const actorQueryType = ref('direct')
// 演员组合查询表单
const actorQueryForm = reactive({
  actor1:'',
  actor2:''
})
const actorConditionalQueryForm = reactive({
  style: '',
  num: 10,
  limit: 2
})
// 导演&演员组合查询表单
const actorDirectorForm = reactive({
  director: '',
  actor: ''
})

// 查询结果
const actorResults = ref([])
const actorDirectorResults = ref([])

// 添加数据库选择状态
const selectedDatabase = ref('all')

// 存储各个数据库的结果
const databaseResults = reactive({
  movie: {
    distributed: [],
    relational: [],
    graph: []
  },
  actor: {
    distributed: [],
    relational: [],
    graph: []
  },
  actorDirector: {
    distributed: [],
    relational: [],
    graph: []
  }
})

// 根据选择的数据库过滤结果
const filteredResults = computed(() => {
  if (selectedDatabase.value === 'all') {
    return searchResults.value
  }
  return databaseResults.movie[selectedDatabase.value]
})

const filteredActorResults = computed(() => {
  if (selectedDatabase.value === 'all') {
    return actorResults.value
  }
  return databaseResults.actor[selectedDatabase.value]
})

const filteredActorDirectorResults = computed(() => {
  if (selectedDatabase.value === 'all') {
    return actorDirectorResults.value
  }
  return databaseResults.actorDirector[selectedDatabase.value]
})

const validateScoreRange = () => {
  if (queryForm.score[1] < queryForm.score[0]) {
    queryForm.score[1] = queryForm.score[0]
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

    // 存储各个数据库的结果
    databaseResults.movie.distributed = distributedResponse.data.results
    databaseResults.movie.relational = relationalResponse.data.results
    databaseResults.movie.graph = graphResponse.data.results

    // 合并所有结果
    searchResults.value = [
      ...distributedResponse.data.results,
      ...relationalResponse.data.results,
      ...graphResponse.data.results,
    ]

    // 先设置显示结果
    showResults.value = true

    // 等待 DOM 完全更新
    await nextTick()

    // 更新图表
    await updateChart([
      distributedResponse.data.performance,  // 150ms
      relationalResponse.data.performance,   // 100ms
      graphResponse.data.performance,        // 80ms
    ])

    logs.value = [
      distributedResponse.data.log,
      relationalResponse.data.log,
      graphResponse.data.log,
    ].map(log => log.split('\n\n').map(entry => entry.replace(/\\n/g, '\n')))
  } catch (error) {
    console.error('查询失败:', error)
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

const updateChart = async (performanceData) => {
  try {
    // 等待 DOM 更新完成
    await nextTick();
    
    // 确保图表容器存在
    if (!chartRef.value) {
      console.warn('Chart container not found');
      return;
    }

    // 如果图表已经存在，销毁它
    if (chart) {
      chart.dispose();
    }

    // 初始化新的图表
    chart = echarts.init(chartRef.value);
    
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
    };
    
    chart.setOption(option);
  } catch (error) {
    console.error('Chart initialization failed:', error);
  }
};

// 在组件卸载时清理图表
onUnmounted(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
});

// 监听窗口大小变化
onMounted(() => {
  const handleResize = () => {
    if (chart) {
      chart.resize();
    }
  };

  window.addEventListener('resize', handleResize);

  // 在组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
});

// 演员组合查询处理
const handleActorQuery = async () => {
  try {
    if (actorQueryType.value === 'direct') {
      const [distributedResponse, relationalResponse, graphResponse] = await Promise.all([
        fetchDistributedActorCooperation(actorQueryForm.actor1, actorQueryForm.actor2),
        fetchRelationalActorCooperation(actorQueryForm.actor1, actorQueryForm.actor2),
        fetchGraphActorCooperation(actorQueryForm.actor1, actorQueryForm.actor2)
      ])

      // 存储各个数据库的结果
      databaseResults.actor.distributed = distributedResponse.data.results
      databaseResults.actor.relational = relationalResponse.data.results
      databaseResults.actor.graph = graphResponse.data.results

      // 合并所有结果
      actorResults.value = [
        ...(distributedResponse.data.results || []),
        ...(relationalResponse.data.results || []),
        ...(graphResponse.data.results || [])
      ]

      showResults.value = true
      await nextTick()

      await updateChart([
        distributedResponse.data.performance,
        relationalResponse.data.performance,
        graphResponse.data.performance,
      ])

      logs.value = [
        distributedResponse.data.log,
        relationalResponse.data.log,
        graphResponse.data.log,
      ].map(log => log.split('\n\n').map(entry => entry.replace(/\\n/g, '\n')))
    } else {
      // 条件查询的处理
      const [distributedResponse, relationalResponse, graphResponse] = await Promise.all([
        fetchDistributedFavoriteActors(actorConditionalQueryForm),
        fetchRelationalFavoriteActors(actorConditionalQueryForm),
        fetchGraphFavoriteActors(actorConditionalQueryForm)
      ])

      // 存储各个数据库的结果
      databaseResults.actor.distributed = distributedResponse.data.results
      databaseResults.actor.relational = relationalResponse.data.results
      databaseResults.actor.graph = graphResponse.data.results

      actorResults.value = [
        ...(distributedResponse.data.results || []),
        ...(relationalResponse.data.results || []),
        ...(graphResponse.data.results || [])
      ]

      showResults.value = true
      await nextTick()

      await updateChart([
        distributedResponse.data.performance,
        relationalResponse.data.performance,
        graphResponse.data.performance,
      ])

      logs.value = [
        distributedResponse.data.log,
        relationalResponse.data.log,
        graphResponse.data.log,
      ].map(log => log.split('\n\n').map(entry => entry.replace(/\\n/g, '\n')))
    }
  } catch (error) {
    console.error('查询失败:', error)
  }
}

// 导演&演员组合查询处理
const handleActorDirectorQuery = async () => {
  try {
    const [distributedResponse, relationalResponse, graphResponse] = await Promise.all([
      fetchDistributedDirectorActorCooperation(actorDirectorForm.director, actorDirectorForm.actor),
      fetchRelationalDirectorActorCooperation(actorDirectorForm.director, actorDirectorForm.actor),
      fetchGraphDirectorActorCooperation(actorDirectorForm.director, actorDirectorForm.actor)
    ])

    // 存储各个数据库的结果
    databaseResults.actorDirector.distributed = distributedResponse.data.results
    databaseResults.actorDirector.relational = relationalResponse.data.results
    databaseResults.actorDirector.graph = graphResponse.data.results

    actorDirectorResults.value = [
      ...distributedResponse.data.results,
      ...relationalResponse.data.results,
      ...graphResponse.data.results
    ]

    showResults.value = true
    await nextTick()

    await updateChart([
      distributedResponse.data.performance,
      relationalResponse.data.performance,
      graphResponse.data.performance,
    ])

    logs.value = [
      distributedResponse.data.log,
      relationalResponse.data.log,
      graphResponse.data.log,
    ].map(log => log.split('\n\n').map(entry => entry.replace(/\\n/g, '\n')))
  } catch (error) {
    console.error('查询失败:', error)
  }
}

// 监听查询类型变化
watch(queryType, () => {
  // 重置结果显示状态
  showResults.value = false
  showLogs.value = false
  // 清空结果数据
  searchResults.value = []
  actorResults.value = []
  actorDirectorResults.value = []
  logs.value = []
  
  // 如果图表存在，清除图表
  if (chart) {
    chart.clear()
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
  display: flex;
  flex-direction: column;  /* 设置为竖直方向 */
  width: 90%; 
  max-width: 1400px; /* 增加最大宽度 */
  margin: 0 auto;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
}

.result-list,
.performance-chart,
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

/* 添加新的样式 */
.query-type-buttons {
  margin-bottom: 20px;
  text-align: center;
}

.chart-container {
  width: 100%;
  height: 400px;
  margin: 0 auto;
}

.database-selector {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 0px;
  flex-wrap: wrap;
}

</style> 