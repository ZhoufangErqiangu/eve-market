<template>
  <div class="manufacture-product">
    <div class="item">
      <div class="header">
        <el-cascader v-model="localType" :options="dataStroe.blueprintOptions" :show-all-levels="false" />
        <el-button size="small" :icon="Close" type="danger" @click="onDelete" />
      </div>
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
import { ElButton, ElCascader, ElInputNumber } from "element-plus";
import "element-plus/es/components/cascader/style/css";
import "element-plus/es/components/input-number/style/css";
import { computed, type PropType } from "vue";
import { buildNewProduct, calculateProductCost, type ManufactureItemType, type ManufactureProductType } from "../";
import { useDataStore } from "../../../stores/data";
import ManufactureItem from "../item/ManufactureItem.vue";
import { formatNumber } from "../../../utils/math";

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
      emits("change", buildNewProduct(value, props.data.quantity, (type: number) => {
        return dataStroe.blueprints[type];
      }, (type: number) => {
        return dataStroe.marketPrices[type]?.avg ?? dataStroe.marketPrices[type]?.adj ?? 0;
      }));
    }
  },
});
const localQuantity = computed({
  get: () => props.data.quantity,
  set: (value) => {
    if (props.data.marketType) {
      emits("change", buildNewProduct(props.data.marketType, value, (type: number) => {
        return dataStroe.blueprints[type];
      }, (type: number) => {
        return dataStroe.marketPrices[type]?.avg ?? dataStroe.marketPrices[type]?.adj ?? 0;
      }));
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
        const nl = [...props.data.materials!];
        nl[i] = item;
        emits("change", {
          ...props.data,
          materials: nl,
        });
      }
    };
  });
});

const value = computed(() => {
  return formatNumber(props.data.quantity * props.data.price);
});
const cost = computed(() => {
  return formatNumber(calculateProductCost(props.data));
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

  .item {
    width: 220px;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 5px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .isk {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .materials {
    margin-top: 5px;

    .list {
      margin-top: 5px;

      display: flex;
      align-items: start;
      flex-wrap: wrap;
      gap: 10px;
    }
  }
}

.manufacture-product+.manufacture-product {
  margin-top: 10px;
}
</style>
