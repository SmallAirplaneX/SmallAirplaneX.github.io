<script setup lang="ts">
const emit = defineEmits(["toggle"]);

// const emitToggle = () => {
//   emit("toggle");
// };
</script>
<template>
  <nav class="navigation-bar">
    <div class="nav-container">
      <!-- <div class="nav-left">
        <img
          src="http://q1.qlogo.cn/g?b=qq&nk=2321764325&s=640"
          alt=""
          width="45"
          height="45"
          style="border-radius: 50%" />
        <router-link to="/" class="nav-brand"> 今晚踢被子 </router-link>
      </div>
      <div class="nav-menu">
        <Button type="text" @click="navigateTo('/')">
          <svg
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 20 20">
            <g fill="none">
              <path
                d="M8.998 2.388a1.5 1.5 0 0 1 2.005 0l5.5 4.942A1.5 1.5 0 0 1 17 8.445V15.5a1.5 1.5 0 0 1-1.5 1.5H13a1.5 1.5 0 0 1-1.5-1.5V12a.5.5 0 0 0-.5-.5H9a.5.5 0 0 0-.5.5v3.5A1.5 1.5 0 0 1 7 17H4.5A1.5 1.5 0 0 1 3 15.5V8.445c0-.425.18-.83.498-1.115l5.5-4.942zm1.336.744a.5.5 0 0 0-.668 0l-5.5 4.942A.5.5 0 0 0 4 8.445V15.5a.5.5 0 0 0 .5.5H7a.5.5 0 0 0 .5-.5V12A1.5 1.5 0 0 1 9 10.5h2a1.5 1.5 0 0 1 1.5 1.5v3.5a.5.5 0 0 0 .5.5h2.5a.5.5 0 0 0 .5-.5V8.445a.5.5 0 0 0-.166-.371l-5.5-4.942z"
                fill="currentColor"></path>
            </g>
          </svg>
        </Button>
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
      </div> -->
    </dPUT
  </nav>
</template>

<style scoped>
.navigation-bar {
  /* background: linear-gradient(145deg, #1f2937, #111827); */
  padding: 0 20px;
  border-bottom: #00000073 solid 1px;
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
  color: oklch(0.7368 0.1825 335.43);
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  /* text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); */
}

.nav-brand:hover {
  color: oklch(0.7368 0.1825 54.48);
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
