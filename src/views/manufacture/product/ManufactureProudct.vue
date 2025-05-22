<template>
  <div class="manufacture-product">
    <div class="item">
      <el-space>
        <el-cascader v-model="localType" :options="dataStroe.blueprintOptions" :show-all-levels="false" />
        <el-button size="small" :icon="Close" type="danger" @click="onDelete" />
      </el-space>
      <el-input-number v-model="localQuantity" :min="1" :step="1" />
      <div class="isk">
        <div class="text1">
          {{ $t("manufacture.product.value") }}
        </div>
        <div class="text2">
          {{ value }}
        </div>
      </div>
      <div class="isk">
        <div class="text1">
          {{ $t("manufacture.product.cost") }}
        </div>
        <div class="text2">
          {{ cost }}
        </div>
      </div>
    </div>
    <div v-if="Boolean(localMaterials)" class="materials">
      <div class="title">
        {{ $t("manufacture.product.materials") }}
      </div>
      <div class="list">
        <ManufactureItem v-for="m of localMaterials" :key="m.data.type" :data="m.data" @change="m.onChange" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Close } from "@element-plus/icons-vue";
import { ElButton, ElCascader, ElInputNumber, ElSpace } from "element-plus";
import "element-plus/es/components/cascader/style/css";
import "element-plus/es/components/input-number/style/css";
import "element-plus/es/components/space/style/css";
import { computed, type PropType } from "vue";
import { buildNewProduct, calculateProductCost, type ManufactureItemType, type ManufactureProductType } from "../";
import { useDataStore } from "../../../stores/data";
import ManufactureItem from "../item/ManufactureItem.vue";

const props = defineProps({
  data: {
    type: Object as PropType<ManufactureProductType>,
    required: true,
  },
});
const emits = defineEmits(["change", "delete"]);

const dataStroe = useDataStore();

const localType = computed<number[] | undefined>({
  get: () => props.data.marketType,
  set: (value) => {
    if (!value) {
      emits("change", { ...props.data, type: undefined, maketType: undefined });
    } else {
      emits("change", buildNewProduct(value, props.data.quantity, dataStroe.readBlueprintByProduct, dataStroe.readMarketPrice));
    }
  },
});
const localQuantity = computed({
  get: () => props.data.quantity,
  set: (value) => {
    if (props.data.marketType) {
      emits("change", buildNewProduct(props.data.marketType, value, dataStroe.readBlueprintByProduct, dataStroe.readMarketPrice));
    } else {
      emits("change", {
        ...props.data,
        quantity: value,
      });
    }
  },
});
const localMaterials = computed(() => {
  if (!props.data.materials) return undefined;

  return props.data.materials.map((m, i) => {
    return {
      data: m,
      onChange: (item: ManufactureItemType) => {
        const newMaterials = [...props.data.materials!];
        newMaterials[i] = item;
        emits("change", {
          ...props.data,
          materials: newMaterials,
        });
      }
    };
  });
});

const value = computed(() => {
  return props.data.quantity * props.data.price;
});
const cost = computed(() => {
  return calculateProductCost(props.data);
});

function onDelete() {
  emits("delete");
}
</script>

<style lang="less" scoped>
.manufacture-product {
  padding: 10px;
  border: solid 1px var(--el-border-color);
  border-radius: var(--el-border-radius-base);

  display: flex;
  flex-direction: column;
  gap: 10px;

  .item {
    width: 260px;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 5px;
  }

  .isk {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .materials {
    width: fit-content;

    .list {
      margin-top: 5px;

      display: flex;
      align-items: start;
      gap: 10px;
    }
  }
}
</style>
