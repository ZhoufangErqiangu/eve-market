<template>
  <div class="scroll-box">
    <el-button v-if="!autoScroll" class="go-btn" :icon="ArrowDownBold" @click="onBottom" />
    <div ref="scrollRef" class="scroll-inner" @wheel="onWheel">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDownBold } from "@element-plus/icons-vue";
import { ElButton } from "element-plus";
import "element-plus/theme-chalk/el-button.css";
import { ref, watch } from "vue";

const props = defineProps({
  onscroll: {
    type: Function,
    default: null,
  },
  scrollCount: {
    type: Number,
    default: 0,
  },
});

const scrollRef = ref<HTMLDivElement>();
const autoScroll = ref(true);

function scrollToBottom() {
  if (!autoScroll.value) return;
  setTimeout(() => {
    if (!scrollRef.value) return;
    scrollRef.value.scrollTo({ top: scrollRef.value.scrollHeight });
  }, 100);
}

function onBottom() {
  autoScroll.value = true;
  scrollToBottom();
}

function onWheel() {
  if (!scrollRef.value) {
    autoScroll.value = false;
    return;
  }
  const max = scrollRef.value.scrollHeight - scrollRef.value.clientHeight;
  const current = scrollRef.value.scrollTop;
  autoScroll.value = (max - current) < 10;
}

watch(() => props.scrollCount, scrollToBottom, { immediate: true });
</script>

<style lang="less" scoped>
.scroll-box {
  position: relative;

  .go-btn {
    position: absolute;
    bottom: 35px;
    right: 35px;
    z-index: 103;
  }

  .scroll-inner {
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    scroll-behavior: smooth;
  }
}
</style>
