<template>
  <div class="manufacture-product">
    <el-cascader v-model="localBlueprint" :options="dataStroe.blueprintOptions" :show-all-levels="false" />
    <div class="box2">
      <el-input-number v-model="localQuantity" :min="1" :step="1" />
      <el-button size="small" :icon="Close" type="danger" @click="onDelete" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Close } from "@element-plus/icons-vue";
import { ElButton, ElCascader, ElInputNumber } from "element-plus";
import "element-plus/es/components/cascader/style/css";
import "element-plus/es/components/input-number/style/css";
import { computed, type PropType } from "vue";
import { type ManufactureProductType } from "../";
import { useDataStore } from "../../../stores/data";

const props = defineProps({
  data: {
    type: Object as PropType<ManufactureProductType>,
    required: true,
  },
});
const emits = defineEmits(["change", "delete"]);

const dataStroe = useDataStore();

const localBlueprint = computed<number[] | undefined>({
  get: () => props.data.maketType,
  set: (value) => {
    if (!value) {
      emits("change", { ...props.data, type: undefined, maketType: undefined });
    } else {
      emits("change", { ...props.data, type: value[value.length - 1], maketType: value });
    }
  },
});
const localQuantity = computed({
  get: () => props.data.quantity,
  set: (value) => {
    emits("change", {
      ...props.data,
      quantity: value,
    });
  },
});

function onDelete() {
  emits("delete");
}
</script>

<style lang="less" scoped>
.manufacture-product {
  width: 220px;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 5px;
  border: solid 1px var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  padding: 10px;

  .box2 {
    display: flex;
    justify-content: space-between;
    align-items: end;
  }
}
</style>
