<script setup lang="ts">
import { ref } from "vue";

// 渲染进程 (renderer.js)
const isDarkMode = ref(false);

// 初始加载时获取系统主题
window.ipcRenderer.invoke("get-system-theme").then((systemIsDarkMode) => {
  isDarkMode.value = systemIsDarkMode;
});
// 监听系统主题更改事件
window.ipcRenderer.on("system-theme-changed", (_, systemIsDarkMode) => {
  isDarkMode.value = systemIsDarkMode;
});
</script>

<template>
  <div>
    <img v-if="isDarkMode" id="nail-white" src="./assets/nail-white.png" />
    <img v-else id="nail-black" src="./assets/nail-black.png" />
  </div>
</template>

<style lang="scss" scoped>
img {
  width: 25px;
  height: 25px;
  -webkit-app-region: drag;
}
body {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
