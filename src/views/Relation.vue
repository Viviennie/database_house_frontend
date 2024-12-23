<template>
    <div class="query-container" v-loading="loading">
      <el-card class="query-form">
        <template #header>
          <div class="card-header">
            <span>关系查询</span>
          </div>
        </template>
        <el-tabs >
            <el-tab-pane label="经常合作的演员组合">
              <el-form :model="queryForm" inline>
                <el-form-item label="结果数量限制">
                  <el-input-number v-model="queryForm.limit" :min="1" placeholder="请输入返回结果数量" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" label="actor" @click="queryCooperatingActors">查询</el-button>
                </el-form-item>
             </el-form>
            </el-tab-pane>
            <el-tab-pane label="经常合作的导演和演员组合">
              <el-form :model="queryForm" inline>
                <el-form-item label="结果数量限制">
                  <el-input-number v-model="queryForm.limit" :min="1" placeholder="请输入返回结果数量" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" label="actorDirector" @click="queryCooperatingDirectorActor">查询</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="最受关注的演员组合">
              <el-form :model="queryForm" inline>
                <el-form-item label="电影类型">
                  <el-input v-model="queryForm.style" placeholder="请输入电影类型" />
                </el-form-item>
                <el-form-item label="演员数量限制">
                  <el-input-number v-model="queryForm.num" :min="1" placeholder="请输入每个组合演员数量" />
                </el-form-item>
                <el-form-item label="结果数量限制">
                  <el-input-number v-model="queryForm.limit" :min="1" placeholder="请输入结果数量限制" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" label="popular"@click="queryMostPopularActors">查询</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
        </el-tabs>
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
          <!-- 关系型数据库的结果 -->
            <el-tab-pane >
              <el-table :data="rr" style="width: 100%; height: 600px;">
                <!-- 根据 currentQueryType 动态显示列 -->
                <el-table-column v-if="currentQueryType === 'actor'" prop="ACTOR_NAME_1" label="演员1" />
                <el-table-column v-if="currentQueryType === 'actor'" prop="ACTOR_NAME_2" label="演员2" />
                <el-table-column v-if="currentQueryType === 'actor'" prop="COOPERATION_COUNT" label="合作次数" />

                <el-table-column v-if="currentQueryType === 'actorDirector'" prop="ACTOR_NAME" label="演员" />
                <el-table-column v-if="currentQueryType === 'actorDirector'" prop="DIRECTOR_NAME" label="导演" />
                <el-table-column v-if="currentQueryType === 'actorDirector'" prop="COOPERATION_COUNT" label="合作次数" />

                <el-table-column v-if="currentQueryType === 'popular'" prop="actor_names" label="演员组合" />
                <el-table-column v-if="currentQueryType === 'popular'" prop="count" label="评论总数" />
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>  
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted} from 'vue'
import {
  fetchCooperatingActorsFromRelational,
  fetchCooperatingDirectorActorFromRelational,
} from '../api/relationalService'
import {
  fetchMostPopularActorsFromRelational
} from '../api/graphService'

  import { ElMessage } from 'element-plus'
  
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
  let chart = null
  const rr=ref([])
  const currentQueryType = ref('') // 当前查询类型，初始为空
  
  const validateScoreRange = () => {
    if (queryForm.score[1] < queryForm.score[0]) {
      queryForm.score[1] = queryForm.score[0]
    }
  }
  
  const queryCooperatingActors = async () => {
    currentQueryType.value = 'actor' // 设置当前查询类型为 "actor"
    loading.value = true
    try {

    const relationalResponse = await fetchCooperatingActorsFromRelational({ limit: queryForm.limit })
    rr.value = relationalResponse.data.data

    ElMessage({ message: "经常合作的演员组合查询成功", type: 'success' })
  } catch (error) {
    ElMessage({ message: '查询失败，请稍后重试', type: 'error' })
  } finally {
    loading.value = false
  }
  } 

  const queryCooperatingDirectorActor = async () => {
    currentQueryType.value = 'actorDirector' // 设置当前查询类型为 "actorDirector"
    loading.value = true
    try {
      const relationalResponse = await fetchCooperatingDirectorActorFromRelational({ limit: queryForm.limit })
      rr.value = relationalResponse.data.data
      ElMessage({ message: "经常合作的导演和演员组合查询成功", type: 'success' })
    } catch (error) {
      ElMessage({ message: '查询失败，请稍后重试', type: 'error' })
    } finally {
      loading.value = false
    }
 }

 const queryMostPopularActors = async () => {
  currentQueryType.value = 'popular' // 设置当前查询类型为 "popular"
  loading.value = true
  try {

    const relationalResponse = await fetchMostPopularActorsFromRelational({ style: queryForm.style, num: queryForm.num, limit: queryForm.limit })
    rr.value = relationalResponse.data.data

    ElMessage({ message: "最受关注的演员组合查询成功", type: 'success' })
  } catch (error) {
    ElMessage({ message: '查询失败，请稍后重试', type: 'error' })
  } finally {
    loading.value = false
  }
 }
  
  
  onMounted(() => {
    window.addEventListener('resize', () => {
      chart?.resize()
    })
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