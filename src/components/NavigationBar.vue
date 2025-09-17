<template>
  <nav class="navigation-bar">
    <div class="nav-container">
      <div class="nav-left">
        <!-- <Button class="nav-toggle" size="sm" @click="emitToggle">☰</Button> -->
        <img
          src="http://q1.qlogo.cn/g?b=qq&nk=2321764325&s=640"
          alt=""
          width="45"
          height="45"
          style="border-radius: 50%" />
        <router-link to="/" class="nav-brand"> 今晚踢被子 </router-link>
      </div>
      <div class="nav-menu">
        <Button variant="ghost" size="sm" @click="navigateTo('/')">首页</Button>
        <Button variant="ghost" size="sm" @click="navigateTo('/node')"
          >Node页面</Button
        >
        <Button variant="ghost" size="sm" @click="navigateTo('/about')"
          >关于</Button
        >
        <button
          class="theme-toggle"
          @click="toggleTheme"
          :data-theme="currentThemeId">
          <span
            class="theme-icon"
            :class="{ active: currentThemeId === 'light' }"
            >☀️</span
          >
          <span
            class="theme-icon"
            :class="{ active: currentThemeId === 'dark' }"
            >🌙</span
          >
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, inject, onMounted } from "vue";
import Button from "./Button.vue";

const router = useRouter();
const emit = defineEmits(["toggle"]);

const currentThemeId = ref("light");
const switchTheme = inject("switchTheme", (themeId: string) => {
  console.log("Switch theme to:", themeId);
});

// const emitToggle = () => {
//   emit("toggle");
// };

const navigateTo = (path: string) => {
  router.push(path);
};

const toggleTheme = () => {
  if (!document.startViewTransition) {
    // 浏览器不支持 View Transitions API
    const newThemeId = currentThemeId.value === "light" ? "dark" : "light";
    currentThemeId.value = newThemeId;
    switchTheme(newThemeId);
    return;
  }

  // 使用 View Transitions API 实现平滑过渡
  document.startViewTransition(() => {
    const newThemeId = currentThemeId.value === "light" ? "dark" : "light";
    currentThemeId.value = newThemeId;
    switchTheme(newThemeId);
  });
};

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    currentThemeId.value = savedTheme;
  }
});
</script>

<style scoped>
.navigation-bar {
  /* background: linear-gradient(145deg, #1f2937, #111827); */
  padding: 0 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.nav-container {
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.nav-left {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.nav-brand {
  /* color: linear-gradient(145deg, #9090cfdc, #8f520cdc); */
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  /* text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); */
}

.nav-brand:hover {
  color: #ff9a8d;
  text-shadow: 0 0 2px rgba(255, 215, 0, 0.5);
}

.nav-menu {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.theme-toggle {
  background: linear-gradient(145deg, #2d3748, #1a202c);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  width: 60px;
  height: 30px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.theme-toggle:hover {
  border-color: rgba(255, 215, 0, 0.5);
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.2);
}

.theme-icon {
  position: absolute;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  opacity: 0.6;
  filter: grayscale(1);
}

.theme-icon:first-child {
  left: 6px;
}

.theme-icon:last-child {
  right: 6px;
}

.theme-icon.active {
  opacity: 1;
  filter: grayscale(0);
  transform: scale(1.2);
}

/* 滑块指示器 */
.theme-toggle::before {
  content: "";
  position: absolute;
  width: 22px;
  height: 22px;
  background: linear-gradient(145deg, #ffd700, #c0a86d);
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  left: 4px;
}

.theme-toggle[data-theme="dark"]::before {
  left: 34px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }

  .nav-menu {
    gap: 0.25rem;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
  }

  .nav-brand {
    font-size: 1.3rem;
  }

  .theme-toggle {
    width: 50px;
    height: 26px;
  }

  .theme-toggle::before {
    width: 18px;
    height: 18px;
  }

  .theme-toggle[data-theme="dark"]::before {
    left: 28px;
  }
}
</style>
