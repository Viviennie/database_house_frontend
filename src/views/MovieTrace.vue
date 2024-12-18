<template>
  <div class="trace-container">
    <el-card class="trace-form">
      <template #header>
        <div class="card-header">
          <span>电影溯源</span>
        </div>
      </template>
      
      <el-form :model="traceForm" label-width="120px">
        <el-form-item label="电影名称">
          <el-input v-model="traceForm.name" placeholder="请输入电影名称" />
        </el-form-item>
        
        <el-form-item label="上映时间">
          <el-date-picker
            v-model="traceForm.releaseDate"
            type="date"
            placeholder="选择上映日期"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleTrace">溯源查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="showResults" class="trace-results">
      <template #header>
        <div class="card-header">
          <span>溯源结果</span>
        </div>
      </template>
      <el-table :data="traceResults" style="width: 100%">
        <el-table-column prop="name" label="电影名称" />
        <el-table-column prop="releaseDate" label="上映时间" />
        <el-table-column prop="asin" label="ASIN码" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { fetchRelationalData } from '../api/relationalService'
import { fetchDistributedData } from '../api/distributedService'

const traceForm = reactive({
  name: '',
  releaseDate: ''
})

const showResults = ref(false)
const traceResults = ref([])

const handleTrace = async () => {
  try {
    const response = await Promise.race([
      fetchRelationalData(traceForm),
      fetchDistributedData(traceForm)
    ])

    traceResults.value = response.data.results
    showResults.value = true
  } catch (error) {
    console.error('溯源查询失败:', error)
    // ElMessage.error('溯源查询失败，请稍后重试')
  }
}
</script>

<style scoped>
.trace-container {
  padding: 80px 20px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.trace-form {
  margin-bottom: 20px;
}

.card-header {
  font-weight: bold;
}
</style> 