<template>
  <div class="manufacture-items">
    <div class="list">
      <div class="title">
        <span>
          {{ $t("manufacture.items.title") }}
        </span>
      </div>
      <ManufactureItem v-for="i of localList" :key="i.id" :data="i.item" @change="i.onChange" @delete="i.onDelete" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { type ManufactureItemType } from "../";
import ManufactureItem from "./ManufactureItem.vue";

const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<ManufactureItemType>>,
    default: () => [],
  },
});
const emits = defineEmits(["update:modelValue"]);

const localList = computed(() => {
  return props.modelValue.map((i, idx) => {
    return {
      id: `${i.type}-${idx}`,
      item: i,
      onChange: (value: ManufactureItemType) => {
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
.manufacture-items {
  padding-bottom: 10px;
  overflow-x: auto;

  .list {
    width: fit-content;
    display: flex;
    gap: 10px;
    align-items: stretch;
  }

  .title {
    border: solid 1px var(--el-border-color);
    border-radius: var(--el-border-radius-base);

    padding: 20px;

    display: flex;
    align-items: center;

    white-space: nowrap;
  }
}
</style>
