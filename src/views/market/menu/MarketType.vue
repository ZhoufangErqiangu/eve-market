<template>
  <div class="market-type" @click="onClick">
    {{ props.data.name }}
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from "vue";

interface MarketType {
  id: number;
  name: string;
}

const props = defineProps({
  data: {
    type: Object as PropType<MarketType>,
    required: true,
  },
});
const emits = defineEmits(["type"]);

function onClick(ev: MouseEvent) {
  ev.stopPropagation();
  emits("type", props.data.id);
}
</script>

<style lang="less" scoped>
.market-type {
  padding: 10px;
  cursor: pointer;

  &:hover {
    color: var(--el-color-primary);
  }
}
</style>
