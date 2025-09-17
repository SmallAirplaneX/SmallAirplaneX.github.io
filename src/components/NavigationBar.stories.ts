import type { Meta, StoryObj } from "@storybook/vue3-vite";
import NavigationBar from "./NavigationBar.vue";

/**
 * 导航栏组件文档
 *
 * 这是一个现代化的顶部导航栏组件，提供清晰的页面导航功能。
 * 导航栏具有响应式设计和活跃状态指示，提升用户体验。
 */
const meta: Meta<typeof NavigationBar> = {
  title: "Components/NavigationBar",
  component: NavigationBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# NavigationBar 组件

一个现代化的顶部导航栏组件，具有以下特性：

- **响应式设计**: 自适应不同屏幕尺寸
- **活跃状态指示**: 当前页面高亮显示
- **品牌标识**: 支持自定义品牌名称和logo
- **无障碍支持**: 完整的键盘导航支持

## 使用示例

\`\`\`vue
<template>
  <NavigationBar />
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue'
</script>
\`\`\`

## 路由配置

导航栏需要与 Vue Router 配合使用，确保路由配置正确：

\`\`\`typescript
// router/index.ts
export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage
  }
]
\`\`\`
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof NavigationBar>;

/**
 * 默认导航栏 - 基础导航功能
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "默认导航栏样式，包含品牌标识和主要导航链接。",
      },
    },
  },
};

/**
 * 当前页面高亮 - 展示活跃状态效果
 */
export const WithActiveState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "展示导航栏在当前页面下的高亮状态效果。需要在 Storybook 的 Canvas 中点击不同链接来查看效果。",
      },
    },
  },
};

/**
 * 导航栏使用场景 - 在完整布局中的展示
 */
export const InLayout: Story = {
  render: () => ({
    components: { NavigationBar },
    template: `
      <div style="min-height: 100vh; background: #0f172a;">
        <NavigationBar />
        <main style="padding: 20px; max-width: 1200px; margin: 0 auto;">
          <div style="background: #1e293b; padding: 24px; border-radius: 8px;">
            <h1 style="color: #e2e8f0; margin: 0 0 16px 0;">页面内容</h1>
            <p style="color: #94a3b8; line-height: 1.6;">
              这是页面的主要内容区域。导航栏固定在顶部，提供整个应用的导航功能。
            </p>
            <p style="color: #94a3b8; line-height: 1.6;">
              用户可以通过导航栏快速在不同页面之间切换，当前页面会有高亮显示。
            </p>
          </div>
        </main>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "展示导航栏在完整页面布局中的使用效果，包括顶部固定定位和内容区域的配合。",
      },
    },
  },
};

/**
 * 导航栏交互说明 - 展示悬停和点击效果
 */
export const InteractionDemo: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## 交互特性

导航栏提供以下交互反馈：

1. **悬停效果**: 鼠标悬停在导航链接上时会有背景色变化
2. **点击反馈**: 点击链接时会有轻微的颜色加深效果
3. **活跃状态**: 当前页面对应的链接会有不同的背景色
4. **焦点管理**: 支持键盘 Tab 键导航和焦点显示

## 无障碍特性

- ✅ 键盘可访问性
- ✅ 屏幕阅读器支持
- ✅ 高对比度模式
- ✅ 焦点指示器
        `.trim(),
      },
    },
  },
};

/**
 * 自定义品牌名称 - 展示品牌定制能力
 */
export const WithCustomBrand: Story = {
  render: () => ({
    components: { NavigationBar },
    template: `
      <div>
        <style>
          .custom-brand {
            color: #10b981 !important;
            font-size: 1.3rem !important;
            font-weight: 700 !important;
          }
        </style>
        <NavigationBar />
        <script>
          // 在实际使用中，可以通过 props 或 CSS 变量来自定义品牌样式
          document.querySelector('.nav-brand').classList.add('custom-brand')
        </script>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "展示如何通过 CSS 自定义导航栏的品牌名称样式。在实际项目中，可以通过组件 props 或 CSS 变量来实现定制化。",
      },
    },
  },
};

/**
 * 导航栏响应式展示 - 不同屏幕尺寸下的表现
 */
export const ResponsiveDemo: Story = {
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: {
            width: "375px",
            height: "667px",
          },
        },
        tablet: {
          name: "Tablet",
          styles: {
            width: "768px",
            height: "1024px",
          },
        },
        desktop: {
          name: "Desktop",
          styles: {
            width: "1024px",
            height: "768px",
          },
        },
      },
    },
    docs: {
      description: {
        story:
          "在不同屏幕尺寸下查看导航栏的响应式表现。使用 Storybook 的 Viewport 工具可以切换不同的设备尺寸。",
      },
    },
  },
};
