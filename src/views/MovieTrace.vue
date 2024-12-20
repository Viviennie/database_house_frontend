<template>
  <div class="trace-container" v-loading="loading">
    <el-card class="trace-form">
      <template #header>
        <div class="card-header">
          <span>电影溯源</span>
        </div>
      </template>
      
      <el-form :model="traceForm" label-width="120px" >
        <el-form-item label="电影名称" >
          <div style="width: 400px;">
            <el-input v-model="traceForm" placeholder="请输入电影名称" clearable />
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleTrace">溯源查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card  class="trace-results">
      <template #header>
        <div class="card-header">
          <span>溯源结果</span>
        </div>
      </template>
      <el-table :data="traceResults" style="width: 100%;height:600px;">
        <el-table-column prop="movie_name" label="电影名称" />
        <el-table-column prop="movie_release_time" label="上映时间" />
        <el-table-column prop="score" label="电影评分"  :formatter="formatScore"/>
        <el-table-column label="ASIN码" >
          <template #default="{ row }">
            <div>
              <div v-for="i in row.version" >
                <span>{{ i }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row >
        <el-col :span="24">
          <div>结果总数：{{ len}}</div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref} from 'vue'
import { traceRelationalData } from '../api/relationalService'
import { ElMessage } from 'element-plus';

const traceForm = ref('')
let loading=ref(false)
const traceResults = ref([])
let len=ref(0)
const handleTrace = async () => {
  loading.value=true
  try {
    const response = await Promise.race([
      traceRelationalData(traceForm),
    ])
    traceResults.value = response.data.data
    len.value=response.data.len
    ElMessage.success("溯源查询成功")

  } catch (error) {
    ElMessage.error("溯源查询失败，请稍后重试")
  }
  finally{
    loading.value=false
  }
}
function formatScore(row, column, cellValue) {
    return cellValue ? cellValue.toFixed(2) : '-';
  }

</script>

<style scoped>
.trace-container {
  padding: 80px 20px 20px;
  width: 100%;
  height: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.trace-form {
  margin-bottom: 20px;
  width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card-header {
  font-weight: bold;
}

.trace-results{
  width: 1200px;

}
</style> 