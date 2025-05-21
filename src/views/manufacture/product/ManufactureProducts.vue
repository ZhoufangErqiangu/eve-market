<template>
  <div class="manufacture-products">
    <div class="list">
      <div class="title">
        <span>
          {{ $t("manufacture.products.title") }}
        </span>
      </div>
      <ManufactureProudct v-for="i of localList" :key="i.id" :data="i.item" @change="i.onChange" @delete="i.onDelete" />
      <div class="add" @click="onAdd">
        <el-icon>
          <Plus />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Plus } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";
import "element-plus/es/components/icon/style/css";
import { type ManufactureProductType } from "../";
import { computed, type PropType } from "vue";
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

function onAdd() {
  emits("update:modelValue", [
    ...props.modelValue,
    {
      quantity: 1,
      source: "manufacture",
    },
  ]);
}
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

  .title {
    border: solid 1px var(--el-border-color);
    border-radius: var(--el-border-radius-base);

    padding: 20px;

    display: flex;
    align-items: center;

    white-space: nowrap;
  }

  .add {
    border: solid 1px var(--el-border-color);
    border-radius: var(--el-border-radius-base);

    padding: 20px;
    cursor: pointer;

    display: flex;
    align-items: center;
  }
}
</style>
