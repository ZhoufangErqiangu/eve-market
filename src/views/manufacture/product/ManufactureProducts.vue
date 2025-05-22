<template>
  <div class="manufacture-products">
    <div class="list">
      <ManufactureProudct v-for="i of localList" :key="i.id" :data="i.item" @change="i.onChange" @delete="i.onDelete" />
    </div>
  </div>
</template>
9
<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { type ManufactureProductType } from "../";
import ManufactureProudct from "./ManufactureProudct.vue";

const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<ManufactureProductType>>,
    default: () => [],
  },
});
const emits = defineEmits(["update:modelValue"]);

const localList = computed(() => {
  return props.modelValue.map((i, idx) => {
    return {
      id: `${i.type}-${idx}`,
      item: i,
      onChange: (value: ManufactureProductType) => {
        emits("update:modelValue", [
          ...props.modelValue.slice(0, idx),
          value,
          ...props.modelValue.slice(idx + 1),
        ]);
      },
      onDelete: () => {
        emits("update:modelValue", [
          ...props.modelValue.slice(0, idx),
          ...props.modelValue.slice(idx + 1),
        ]);
      },
    };
  });
});
</script>

<style lang="less" scoped>
.manufacture-products {
  padding-bottom: 10px;
  overflow-x: auto;

  .list {
    width: fit-content;
    display: flex;
    gap: 10px;
    align-items: stretch;
  }
}
</style>
