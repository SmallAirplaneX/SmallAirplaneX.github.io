<template>
  <div class="container">
    <!-- 顶部导航条 -->
    <div class="navigation-bar-wrapper" :class="{ collapsed: isNavCollapsed }">
      <NavigationBar @toggle="toggleNavigation" />
    </div>

    <!-- 主要内容区域 -->
    <div class="content-area">
      <!-- 左侧边栏 -->
      <div class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
        <div class="sidebar-header">
          <!-- <Button class="toggle-btn" size="sm" @click="toggleSidebar">
            {{ isSidebarCollapsed ? "→" : "←" }}
          </Button> -->
          <span v-if="!isSidebarCollapsed">侧边栏</span>
        </div>
        <div class="sidebar-content" v-if="!isSidebarCollapsed">
          <!-- 侧边栏内容暂时留空 -->
        </div>
      </div>

      <!-- 主内容区域 -->
      <main class="main-content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NavigationBar from "@/components/NavigationBar.vue";
import Button from "@/components/Button.vue";

const isNavCollapsed = ref(true);
const isSidebarCollapsed = ref(true);

const toggleNavigation = () => {
  isNavCollapsed.value = !isNavCollapsed.value;
};

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  gap: 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "navigation"
    "content";
  height: 100vh;
  width: 100%;
}

.navigation-bar-wrapper {
  grid-area: navigation;
  transition: all 0.3s ease;
}

.navigation-bar-wrapper.collapsed {
  height: 0;
  overflow: hidden;
}

.content-area {
  grid-area: content;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr;
  gap: 0px;
  grid-auto-flow: row;
  grid-template-areas: "sidebar main";
  height: 100%;
}

.sidebar {
  grid-area: sidebar;
  /* background: linear-gradient(145deg, #1e1e1f73, #0f0800dc); */
  border-right: 1px solid var(--color-border);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 85px;
  width: 240px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
}

.sidebar.collapsed {
  min-width: 30px;
  width: 60px;
}

.sidebar-header {
  padding: 0.5rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  /* background: rgba(37, 26, 13, 0.137); */
  height: 60px;
  min-height: 60px;
  backdrop-filter: blur(10px);
}

.sidebar-header span {
  font-weight: 600;
  /* color: #e2e8f0; */
  font-size: 1.1rem;
  transition: opacity 0.2s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.sidebar.collapsed .sidebar-header span {
  opacity: 0;
  pointer-events: none;
}

.sidebar-content {
  flex: 1;
  padding: 1rem;
  opacity: 1;
  transition: opacity 0.2s ease;
  /* color: #cbd5e0; */
}

.sidebar.collapsed .sidebar-content {
  opacity: 0;
  pointer-events: none;
}

.main-content {
  grid-area: main;
  padding: 2rem;
  overflow-y: auto;
  /* background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); */
  min-height: calc(100vh - 60px);
  /* color: #e2e8f0; */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-area {
    grid-template-columns: 1fr;
    grid-template-areas: "main";
  }

  .sidebar {
    position: fixed;
    top: 230px;
    bottom: 0;
    z-index: 1000;
    width: 85px;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.5);
  }

  .sidebar-header {
    height: 90px;
  }

  .sidebar:not(.collapsed) {
    left: 0;
  }

  .sidebar.collapsed {
    left: -280px;
  }

  .main-content {
    padding: 1.5rem;
  }
}
</style>
