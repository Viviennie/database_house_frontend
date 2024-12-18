<template>
    <div class="doc-container">
      <el-card class="doc-content">
        <template #header>
          <div class="card-header">
            <span>项目文档</span>
          </div>
        </template>
        <div class="markdown-body" v-html="markdownContent"></div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { marked } from 'marked'
  
  const markdownContent = ref('')
  
  // 使用静态的 markdown 内容
  const markdown = `
  # 电影查询与溯源系统
  
  ## 项目简介
  本系统是一个基于 Vue3 + Vite 构建的电影查询和溯源网站。
  
  ## 主要功能
  1. 电影查询
     - 支持多条件查询
     - 性能对比展示
  2. 电影溯源
     - ASIN码追踪
  3. 项目文档
  
  ## 技术栈
  - Vue 3
  - Vite
  - Element Plus
  - ECharts
  - Axios
  
  ## 使用说明
  ...待补充
  `
  
  markdownContent.value = marked(markdown)
  </script>
  
  <style scoped>
  .doc-container {
    padding: 80px 20px 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .markdown-body {
    padding: 20px;
  }
  
  .card-header {
    font-weight: bold;
  }
  
  /* 添加一些基本的 markdown 样式 */
  .markdown-body h1 {
    font-size: 2em;
    margin-bottom: 0.5em;
  }
  
  .markdown-body h2 {
    font-size: 1.5em;
    margin: 1em 0 0.5em;
  }
  
  .markdown-body ul {
    padding-left: 2em;
    margin: 1em 0;
  }
  
  .markdown-body li {
    margin: 0.5em 0;
  }
  </style> 