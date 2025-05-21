<template>
  <div class="manufacture-product">
    <el-cascader v-model="localBlueprint" :options="dataStroe.blueprintOptions" />
    <div class="box2">
      <el-input-number v-model="localQuantity" :min="1" :step="1" />
      <el-button :icon="Close" type="danger" @click="onDelete" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Close } from "@element-plus/icons-vue";
import { ElButton, ElCascader, ElInputNumber } from "element-plus";
import "element-plus/es/components/cascader/style/css";
import "element-plus/es/components/input-number/style/css";
import { computed, type PropType } from "vue";
import { type ManufactureItem } from "../";
import { useDataStore } from "../../../stores/data";

const props = defineProps({
  data: {
    type: Object as PropType<ManufactureItem>,
    required: true,
  },
});
const emits = defineEmits(["change", "delete"]);

const dataStroe = useDataStore();

const localBlueprint = computed({
  get: () => {
    if (!props.data.type) return undefined;
    const b = dataStroe.readBlueprint(props.data.type);
    return b?.type;
  },
  set: (value) => {
    if (!value) {
      emits("change", {
        ...props.data,
        type: undefined,
      });
    } else {
      const b = dataStroe.readBlueprint(value);
      emits("change", {
        ...props.data,
        type: b?.product,
      });
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
  width: 300px;

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
    text-align: right;
  }
}
</style>
