<template>
  <div class="trace-container" v-loading="loading">
    <el-card class="trace-form">
      <template #header>
        <div class="card-header">
          <span>电影溯源</span>
        </div>
      </template>
      
      <el-form :model="traceForm" label-width="120px" v-show="!showDetail" >
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

    <el-card  class="trace-results" v-show="!showDetail">
      <template #header>
        <div class="card-header">
          <span>溯源结果</span>
        </div>
      </template>
      <el-table :data="traceResults" style="width: 100%;height:600px;">
        <el-table-column prop="movie_name" label="电影名称" />
        <el-table-column prop="time" label="上映时间" />
        <el-table-column prop="id" label="电影ID" />
        <el-table-column prop="score" label="电影评分"  :formatter="formatScore"/>
        <el-table-column label="操作">
          <template #default="scope">
           <el-button type="primary" link @click="showMovieDetail(scope.row)">
             查看详情
           </el-button>
         </template>
        </el-table-column>
      </el-table>
      <el-row>
      <el-col :span="24">
        <div>结果总数：{{ traceResults.length }}</div>
      </el-col>
    </el-row>
   </el-card>
    <el-card v-show="showDetail" class="detail-card">
     <template #header>
       <div class="card-header">
         <el-button type="primary" link @click="showDetail = false">
           返回列表
         </el-button>
         <span>电影详情</span>
       </div>
     </template>
     <div class="detail-content" v-if="selectedMovie">
       <h3>{{ selectedMovie.movie_name }}</h3>
       <p>ID: {{ selectedMovie.id }}</p>
       <p>上映时间: {{ selectedMovie.time }}</p>
       <p>ASIN: 
          <template v-for="(asin, index) in selectedMovie.asin" :key="index">
            <div style="margin-bottom: 5px;"> <!-- 或使用其他合适的容器 -->
             <a :href="formatAmazonUrl(asin)" target="_blank">{{ formatAmazonUrl(asin) }}</a>
            </div>
          </template>
       </p>
       <div class="detail-section">
       <h4>演员信息</h4>
       <el-table :data="selectedMovie.actor" style="width: 100%">
         <el-table-column prop="name" label="演员名称" />
         <el-table-column label="ASIN">
           <template #default="{ row }">
             <template v-for="(asin, index) in row.asin" :key="index">
               <a :href="formatAmazonUrl(asin)" target="_blank">{{ formatAmazonUrl(asin) }}</a>
               <span v-if="index < row.asin.length - 1">, </span>
             </template>
           </template>
         </el-table-column>
       </el-table>
     </div>
     <div class="detail-section">
       <h4>导演信息</h4>
       <el-table :data="selectedMovie.director" style="width: 100%">
         <el-table-column prop="name" label="导演名称" />
         <el-table-column label="ASIN">
           <template #default="{ row }">
             <template v-for="(asin, index) in row.asin" :key="index">
               <a :href="formatAmazonUrl(asin)" target="_blank">{{ formatAmazonUrl(asin) }}</a>
               <span v-if="index < row.asin.length - 1">, </span>
             </template>
           </template>
         </el-table-column>
       </el-table>
     </div>
       <div class="detail-section">
         <h4>版本信息</h4>
         <el-table :data="selectedMovie.version" style="width: 100%">
           <el-table-column prop="name" label="版本名称" />
           <el-table-column label="ASIN">
             <template #default="{ row }">
               <template v-for="(asin, index) in row.asin" :key="index">
                <a :href="formatAmazonUrl(asin)" target="_blank">{{ formatAmazonUrl(asin) }}</a>
                 <span v-if="index < row.asin.length - 1">, </span>
               </template>
             </template>
           </el-table-column>
         </el-table>
       </div>
     </div>
   </el-card>
  </div>
</template>

<script setup>
import { ref} from 'vue'
import { traceRelationalData } from '../api/relationalService'
import { traceGraphData } from '../api/graphService'
import { ElMessage } from 'element-plus';

const traceForm = ref('')
let loading=ref(false)
const selectedMovie = ref(null)
const showDetail = ref(false)
const traceResults = ref([])
let len=ref(0)
const handleTrace = async () => {
  loading.value=true
  try {
    const response = await Promise.race([
      //traceRelationalData(traceForm),
      traceGraphData(traceForm)
    ])
    // 添加控制台打印
   console.log('API返回的原始数据:', JSON.stringify(response.data, null, 2))

    traceResults.value = response.data
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
  const showMovieDetail = (movie) => {
  selectedMovie.value = movie
  showDetail.value = true
}
// 添加亚马逊链接格式化函数
const formatAmazonUrl = (asin) => `http://amazon.com/dp/${asin}`
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
.detail-content{
  width: 1000px;
  padding: 30px;
}
h3 {
  word-wrap: break-word;
  word-break: break-word;
}
</style> 