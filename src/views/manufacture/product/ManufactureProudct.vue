<template>
  <div class="manufacture-product">
    <el-space class="item">
      <el-cascader v-model="localType" class="type" :options="dataStroe.blueprintOptions" :show-all-levels="false" />
      <el-divider direction="vertical" />
      <!-- there is a issue on quanity. will build a new product when change quantity, this causes all items be set to new. -->
      <el-input-number v-model="localQuantity" class="quantity" :disabled="true" :min="1" :step="1" />
      <el-divider direction="vertical" />
      <div class="isk">
        <div class="text1">
          {{ $t("manufacture.product.value") }}
        </div>
        <div class="text2">
          {{ value }}
        </div>
      </div>
      <el-divider direction="vertical" />
      <div class="isk">
        <div class="text1">
          {{ $t("manufacture.product.cost") }}
        </div>
        <div class="text2">
          {{ cost }}
        </div>
      </div>
      <el-divider direction="vertical" />
      <el-button :icon="Close" type="danger" @click="onDelete" />
    </el-space>
    <el-collapse class="detail">
      <el-collapse-item :title="$t('manufacture.product.route')" name="route">
        <ProductRoute :data="props.data.materials" @source="onSource" />
      </el-collapse-item>
      <el-collapse-item :title="$t('manufacture.product.materials')" name="materials">
        <ProductMaterials :data="materials" @source="onSource" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { Close } from "@element-plus/icons-vue";
import { ElButton, ElCascader, ElCollapse, ElCollapseItem, ElDivider, ElInputNumber, ElSpace } from "element-plus";
import "element-plus/es/components/cascader/style/css";
import "element-plus/es/components/collapse-item/style/css";
import "element-plus/es/components/collapse/style/css";
import "element-plus/es/components/divider/style/css";
import "element-plus/es/components/input-number/style/css";
import "element-plus/es/components/space/style/css";
import { computed, type PropType } from "vue";
import { aggregateManufactureItem, buildNewProduct, calculateProductCost, type ManufactureItemSource, type ManufactureItemType, type ManufactureProductType } from "../";
import { useDataStore } from "../../../stores/data";
import { formatNumber } from "../../../utils/math";
import ProductMaterials from "./ManufactureProductMaterials.vue";
import ProductRoute from "./ManufactureProductRoute.vue";

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
      emits("change", buildNewProduct(
        value,
        props.data.quantity,
        dataStroe.readBlueprint,
        dataStroe.readPlanetSchematic,
        dataStroe.readMarketPrice,
      ));
    }
  },
});
const localQuantity = computed({
  get: () => props.data.quantity,
  set: (value) => {
    if (props.data.marketType) {
      emits("change", buildNewProduct(
        props.data.marketType,
        value,
        dataStroe.readBlueprint,
        dataStroe.readPlanetSchematic,
        dataStroe.readMarketPrice,
      ));
    } else {
      emits("change", {
        ...props.data,
        quantity: value,
      });
    }
  },
});

const value = computed(() => {
  return formatNumber(props.data.quantity * props.data.price);
});
const cost = computed(() => {
  return formatNumber(calculateProductCost(props.data));
});

const materials = computed(() => aggregateManufactureItem(props.data));

function onSource(type: number, source: ManufactureItemSource) {
  const ud: (data: ManufactureItemType, type: number, source: ManufactureItemSource) => ManufactureItemType = (data, type, source) => {
    return {
      ...data,
      source: data.type === type ? source : data.source,
      materials: data.materials?.map((m) => {
        return ud(m, type, source);
      })
    };
  };
  emits("change", {
    ...props.data,
    materials: props.data.materials?.map((m) => {
      return ud(m, type, source);
    }),
  });
}

function onDelete() {
  emits("delete");
}
</script>

<style lang="less" scoped>
.manufacture-product {
  padding: 10px;
  border: solid 1px var(--el-border-color);
  border-radius: var(--el-border-radius-base);

  .type {
    width: 220px;
  }

  .isk {
    width: 200px;

    display: flex;
    justify-content: space-between;
  }

  .detail {
    margin-top: 5px;
  }
}

.manufacture-product+.manufacture-product {
  margin-top: 10px;
}
</style>
