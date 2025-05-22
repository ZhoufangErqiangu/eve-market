<template>
  <div class="manufacture-products">
    <ManufactureProudct v-for="i of localList" :key="i.id" :data="i.item" @change="i.onChange" @delete="i.onDelete" />
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
        const nl = [...props.modelValue];
        nl[idx] = value;
        emits("update:modelValue", nl);
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

<style lang="less" scoped></style>
