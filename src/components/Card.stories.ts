import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Card from "./Card.vue";

/**
 * 卡片组件文档
 *
 * 这是一个现代化的卡片组件，具有物理反馈效果和暗黑主题设计。
 * 卡片在悬停和点击时会有真实的视觉反馈，提供良好的用户体验。
 */
const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    hover: {
      control: "boolean",
      description: "是否启用悬停效果",
      table: {
        defaultValue: { summary: "true" },
      },
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# Card 组件

一个现代化的卡片容器组件，具有以下特性：

- **物理反馈**: 真实的悬停和点击效果，提供触觉反馈
- **模块化设计**: 支持头部、主体、底部三个区域
- **暗黑主题**: 专为暗色界面设计的高级配色
- **灵活布局**: 支持各种内容类型的展示

## 使用示例

\`\`\`vue
<template>
  <Card>
    <template #header>
      <h3>卡片标题</h3>
    </template>
    <p>这里是卡片的主要内容区域</p>
    <template #footer>
      <button>操作按钮</button>
    </template>
  </Card>
</template>

<script setup>
import Card from '@/components/Card.vue'
</script>
\`\`\`
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

/**
 * 基础卡片 - 包含所有区域的基本卡片
 */
export const Basic: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card>
        <template #header>
          <h3 style="margin: 0; color: #e2e8f0;">卡片标题</h3>
        </template>
        <div>
          <p style="margin: 0; color: #94a3b8;">这里是卡片的主要内容区域，可以放置各种类型的内容。</p>
          <p style="margin: 8px 0 0 0; color: #94a3b8;">支持多行文本、图片、列表等。</p>
        </div>
        <template #footer>
          <div style="display: flex; gap: 8px;">
            <button style="padding: 6px 12px; background: #6366f1; border: none; border-radius: 4px; color: white; cursor: pointer;">
              确认
            </button>
            <button style="padding: 6px 12px; background: transparent; border: 1px solid #94a3b8; border-radius: 4px; color: #94a3b8; cursor: pointer;">
              取消
            </button>
          </div>
        </template>
      </Card>
    `,
  }),
};

/**
 * 只有主体的卡片 - 简洁的内容展示
 */
export const BodyOnly: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card>
        <div>
          <h4 style="margin: 0 0 12px 0; color: #e2e8f0;">简洁内容</h4>
          <p style="margin: 0; color: #94a3b8; line-height: 1.5;">
            这是一个只有主体内容的卡片，适合展示简单的信息或提示。
          </p>
        </div>
      </Card>
    `,
  }),
};

/**
 * 带标题的卡片 - 包含标题和内容
 */
export const WithHeader: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card>
        <template #header>
          <h3 style="margin: 0; color: #e2e8f0;">用户信息</h3>
        </template>
        <div>
          <p style="margin: 0 0 8px 0; color: #94a3b8;"><strong>姓名:</strong> 张三</p>
          <p style="margin: 0 0 8px 0; color: #94a3b8;"><strong>邮箱:</strong> zhangsan@example.com</p>
          <p style="margin: 0; color: #94a3b8;"><strong>角色:</strong> 管理员</p>
        </div>
      </Card>
    `,
  }),
};

/**
 * 带底部操作的卡片 - 包含内容和操作按钮
 */
export const WithFooter: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card>
        <div>
          <h4 style="margin: 0 0 12px 0; color: #e2e8f0;">操作确认</h4>
          <p style="margin: 0; color: #94a3b8;">
            确定要执行此操作吗？此操作不可撤销。
          </p>
        </div>
        <template #footer>
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button style="padding: 6px 16px; background: transparent; border: 1px solid #94a3b8; border-radius: 4px; color: #94a3b8; cursor: pointer;">
              取消
            </button>
            <button style="padding: 6px 16px; background: #ef4444; border: none; border-radius: 4px; color: white; cursor: pointer;">
              确认删除
            </button>
          </div>
        </template>
      </Card>
    `,
  }),
};

/**
 * 禁用悬停效果 - 展示无悬停效果的卡片
 */
export const NoHover: Story = {
  args: {
    hover: false,
  },
  render: (args) => ({
    components: { Card },
    setup() {
      return { args };
    },
    template: `
      <Card v-bind="args">
        <div>
          <h4 style="margin: 0 0 12px 0; color: #e2e8f0;">禁用悬停效果</h4>
          <p style="margin: 0; color: #94a3b8;">
            这个卡片禁用了悬停效果，适合在不需要交互反馈的场景使用。
          </p>
        </div>
      </Card>
    `,
  }),
};

/**
 * 卡片组合展示 - 多个卡片的布局示例
 */
export const CardGrid: Story = {
  render: () => ({
    components: { Card },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; max-width: 800px;">
        <Card>
          <template #header>
            <h4 style="margin: 0; color: #e2e8f0;">功能特性</h4>
          </template>
          <p style="margin: 0; color: #94a3b8;">现代化的设计语言，提供一致的视觉体验</p>
        </Card>
        
        <Card>
          <template #header>
            <h4 style="margin: 0; color: #e2e8f0;">性能优化</h4>
          </template>
          <p style="margin: 0; color: #94a3b8;">轻量级实现，确保流畅的用户交互体验</p>
        </Card>
        
        <Card>
          <template #header>
            <h4 style="margin: 0; color: #e2e8f0;">无障碍支持</h4>
          </template>
          <p style="margin: 0; color: #94a3b8;">完整的键盘导航和屏幕阅读器支持</p>
        </Card>
      </div>
    `,
  }),
  parameters: {
    layout: "padded",
  },
};

/**
 * 复杂内容卡片 - 展示卡片容纳复杂内容的能力
 */
export const ComplexContent: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card>
        <template #header>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <h3 style="margin: 0; color: #e2e8f0;">项目概览</h3>
            <span style="color: #10b981; font-size: 0.875rem;">● 在线</span>
          </div>
        </template>
        <div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <div style="color: #94a3b8; font-size: 0.875rem;">用户数</div>
              <div style="color: #e2e8f0; font-size: 1.5rem; font-weight: bold;">1,234</div>
            </div>
            <div>
              <div style="color: #94a3b8; font-size: 0.875rem;">活跃度</div>
              <div style="color: #e2e8f0; font-size: 1.5rem; font-weight: bold;">87%</div>
            </div>
          </div>
          <div style="height: 2px; background: rgba(255, 255, 255, 0.1); margin: 16px 0;"></div>
          <p style="margin: 0; color: #94a3b8; font-size: 0.875rem;">
            最近更新: 2024年1月15日 • 版本: v2.1.0
          </p>
        </div>
        <template #footer>
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button style="padding: 6px 12px; background: transparent; border: 1px solid #94a3b8; border-radius: 4px; color: #94a3b8; cursor: pointer;">
              查看详情
            </button>
            <button style="padding: 6px 12px; background: #6366f1; border: none; border-radius: 4px; color: white; cursor: pointer;">
              编辑设置
            </button>
          </div>
        </template>
      </Card>
    `,
  }),
};
