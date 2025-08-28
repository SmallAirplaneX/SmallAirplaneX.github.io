<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import { Schema } from "prosemirror-model";
import { Selection, Transaction } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { EditorView } from "prosemirror-view";
import { baseKeymap } from "prosemirror-commands";
import { EditorState, Plugin } from "prosemirror-state";
import { undo, redo, history } from "prosemirror-history";
import { ReplaceStep, ReplaceAroundStep } from "prosemirror-transform";

// 1. 编辑器容器引用（用于挂载 DOM）
const view = ref<EditorView | null>(null);
const editorRef = useTemplateRef("editor");
// 定义模式（启用）
const simpleSchema = new Schema({
  nodes: {
    doc: { content: "block+" }, // 顶级节点，包含一个或多个块
    block: {
      content: "text*",
      toDOM() {
        return ["p", 0];
      },
      // parseDOM: [{ tag: "block" }],
    }, // 块级节点，包含一个或多个内联节点
    text: {},
  },
  // 标记
  marks: {
    strong: {},
    em: {},
  },
});

// 创建一个用于跟踪鼠标位置的插件
const mousePositionPlugin = new Plugin({
  view(view) {
    return new BlockTooltip(view);
  },
});

class BlockTooltip {
  pos: number;
  lastPos: number;
  view: EditorView;
  offset: number;
  tooltip: HTMLButtonElement;
  handleMouseMove: (event: MouseEvent) => void;
  constructor(view: EditorView) {
    this.pos = 0;
    this.offset = 0;
    this.lastPos = 0;
    this.view = view;
    this.tooltip = document.createElement("button");
    this.tooltip.textContent = "+";
    //
    this.tooltip.style.cssText = `
      position: absolute;
      display: block;
      top:0px;
      left:0px;
      padding: 4px 8px;
      background: #333;
      color: white;
      cursor: pointer;
      border-radius: 4px;
      font-size: 12px;
      transition: opacity 0.2s;
      transition: top 0.2s cubic-bezier(0.12, 0.89, 0, 1.04);
      z-index: 1000;
    `;

    const selectionToInsertionEnd = (
      tr: Transaction,
      startLen: number,
      bias: number
    ) => {
      let last = tr.steps.length - 1;
      if (last < startLen) return;
      let step = tr.steps[last];
      if (!(step instanceof ReplaceStep || step instanceof ReplaceAroundStep))
        return;
      let map = tr.mapping.maps[last];
      let end: number | null = null;
      map.forEach((_from, _to, _newFrom, newTo) => {
        if (end == null) end = newTo;
      });
      tr.setSelection(Selection.near(tr.doc.resolve(end!), bias));
    };

    view.dom.parentNode?.appendChild(this.tooltip);

    this.tooltip.addEventListener("click", () => {
      // 获取焦点
      this.view.focus();
      // 插入新的block
      console.log(this.pos);
      console.log(this.offset);
      const tr = this.view.state.tr.insert(
        this.offset + this.pos - 1,
        simpleSchema.nodes.block.create()
      );
      selectionToInsertionEnd(tr, 0, -1);
      this.view.dispatch(tr);
    });

    this.handleMouseMove = (event: MouseEvent) => {
      // 获取距鼠标位置最近的光标位置标签视为1，inside为当前标签开始的位置
      const pos = this.view.posAtCoords({
        left: event.clientX,
        top: event.clientY,
      });
      if (!pos) return;

      // 获取位置上下文
      const $pos = this.view.state.doc.resolve(pos.pos);
      // 获取父节点
      const posNode = $pos.parent;

      // 判断是不是块
      if (!posNode || posNode.type.name !== "block") return;
      this.offset = posNode.nodeSize;
      this.lastPos = this.pos; // 旧位置
      this.pos = $pos.start(); // 新位置

      // 如果位置没有变化，则不更新tooltip
      if (this.lastPos === this.pos) return;
      // 获取块级元素的位置信息
      const { left, top } = this.view.coordsAtPos(this.pos);
      // 设置tooltip的位置

      this.tooltip.style.left = `${left - 40}px`;
      this.tooltip.style.top = `${top}px`;
    };

    view.dom.addEventListener("mousemove", this.handleMouseMove);
  }

  destroy() {
    this.tooltip.remove();
    this.view.dom.removeEventListener("mousemove", this.handleMouseMove);
  }
}

onMounted(() => {
  if (!editorRef.value) return;
  let state = EditorState.create({
    schema: simpleSchema, // 使用预定义的模式，并自动生成空内容
    plugins: [
      history(), // 添加历史记录插件
      keymap({ "Mod-z": undo, "Mod-y": redo }), // 自定义快捷键
      keymap(baseKeymap), // 基础快捷键
      mousePositionPlugin,
    ],
  });
  view.value = new EditorView(editorRef.value, { state });
});

onUnmounted(() => {
  if (view.value) {
    view.value.destroy();
  }
});
</script>

<template>
  <div class="editor-container" ref="editor"></div>
</template>

<style scoped>
.editor-container {
  width: 100%;
  height: 100%;
}

:deep(.ProseMirror) {
  border: 1px solid #ccc;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  padding: 10px 10px 10px 50px;
  outline: none;
}
</style>
