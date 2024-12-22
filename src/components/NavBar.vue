<template>
  <el-menu
    :default-active="activeIndex"
    class="nav-menu"
    mode="horizontal"
    router
    :background-color="'var(--primary-color)'"  
    text-color="#fff"
    active-text-color="var(--secondary-color)" 
  >
    <el-menu-item index="/movie-query">
      <el-icon><Search /></el-icon>
      电影查询
    </el-menu-item>
    <el-menu-item index="/movie-trace">
      <el-icon><Connection /></el-icon>
      电影溯源
    </el-menu-item>
    <el-menu-item index="/documentation">
      <el-icon><Document /></el-icon>
      项目文档
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Search, Connection, Document } from '@element-plus/icons-vue'

const route = useRoute()
const activeIndex = ref(route.path)

watch(() => route.path, (newPath) => {
  activeIndex.value = newPath
})
</script>

<style scoped>
.nav-menu {
  position:relative;
  top: 0;
  width: 100%;
  z-index: 1000;
}
/* 添加悬停效果 */
:deep(.el-menu-item:hover) {
  background-color: var(--secondary-color) !important;
  color: #ffffff !important;
}
</style> 