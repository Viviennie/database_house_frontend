<template>
  <div class="app-container">
    <nav-bar />
    <router-view v-slot="{ Component }">
      <transition :name="$route.meta.transition || 'fade'" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style>
:root {
  --primary-color: #072747;
  --background-color: #cad8ee;
}

.app-container {
  position: absolute;
  top: 0;
  left: 0;
  height: auto;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: var(--background-color);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 过渡动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 
