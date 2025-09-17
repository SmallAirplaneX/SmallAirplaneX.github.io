import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Button from "./Button.vue";

/**
 * 按钮组件文档
 *
 * 这是一个具有物理反馈效果的高级按钮组件，支持多种变体和尺寸。
 * 按钮在点击时会有真实的按下效果，提供良好的用户体验。
 */
const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "accent", "ghost"],
      description: "按钮变体样式",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "按钮尺寸",
      table: {
        defaultValue: { summary: "md" },
      },
    },
    disabled: {
      control: "boolean",
      description: "是否禁用按钮",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onClick: {
      action: "clicked",
      description: "点击事件回调",
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# Button 组件

一个现代化的按钮组件，具有以下特性：

- **物理反馈**: 真实的按下效果，提供触觉反馈
- **多种变体**: 支持 primary、secondary、accent、ghost 四种样式
- **多种尺寸**: 支持 sm、md、lg 三种尺寸
- **无障碍支持**: 完整的键盘导航和焦点管理
- **暗黑主题**: 专为暗色界面设计的高级配色

## 使用示例

\`\`\`vue
<template>
  <Button variant="primary" size="md" @click="handleClick">
    点击我
  </Button>
</template>

<script setup>
import Button from '@/components/Button.vue'

const handleClick = () => {
  console.log('按钮被点击了!')
}
</script>
\`\`\`
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

/**
 * 主要按钮 - 用于主要操作
 */
export const Primary: Story = {
  args: {
    variant: "primary",
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">主要按钮</Button>',
  }),
};

/**
 * 次要按钮 - 用于次要操作
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">次要按钮</Button>',
  }),
};

/**
 * 强调按钮 - 用于需要特别关注的操作
 */
export const Accent: Story = {
  args: {
    variant: "accent",
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">强调按钮</Button>',
  }),
};

/**
 * 幽灵按钮 - 用于背景复杂的场景
 */
export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">幽灵按钮</Button>',
  }),
};

/**
 * 小尺寸按钮 - 用于紧凑的界面
 */
export const Small: Story = {
  args: {
    size: "sm",
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">小按钮</Button>',
  }),
};

/**
 * 大尺寸按钮 - 用于需要突出显示的界面
 */
export const Large: Story = {
  args: {
    size: "lg",
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">大按钮</Button>',
  }),
};

/**
 * 禁用状态按钮 - 不可交互状态
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">禁用按钮</Button>',
  }),
};

/**
 * 点击事件测试 - 展示点击回调功能
 */
export const WithClickHandler: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args" @click="args.onClick">点击测试</Button>',
  }),
  parameters: {
    docs: {
      description: {
        story:
          "这个示例展示了按钮的点击事件处理功能。点击按钮会在 Actions 面板中显示点击事件。",
      },
    },
  },
};

/**
 * 所有变体展示 - 在一个界面中展示所有按钮样式
 */
export const AllVariants: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "展示所有按钮变体的外观对比",
      },
    },
  },
};

/**
 * 所有尺寸展示 - 在一个界面中展示所有按钮尺寸
 */
export const AllSizes: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "展示所有按钮尺寸的外观对比",
      },
    },
  },
};
