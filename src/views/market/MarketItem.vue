<template>
  <div class="market-item-box">
    <div class="market-item-header">
      <div class="market-item-name">
        {{ props.data.name }}
      </div>
    </div>
    <div class="market-item-body">
      <el-row :gutter="15">
        <el-col :span="6">
          <MarketItemPrice :title="$t('market.item.avg')" :price="price?.avg" />
        </el-col>
        <el-col :span="6">
          <MarketItemPrice :title="$t('market.item.adj')" :price="price?.adj" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElCol, ElRow } from "element-plus";
import "element-plus/es/components/col/style/css";
import "element-plus/es/components/row/style/css";
import { computed, type PropType } from "vue";
import { useDataStore } from "../../stores/data";
import MarketItemPrice from "./MarketItemPrice.vue";

interface MarketType {
  id: number;
  name: string;
}

const dataStore = useDataStore();

const props = defineProps({
  data: {
    type: Object as PropType<MarketType>,
    required: true,
  },
});
const price = computed(() => {
  return dataStore.marketPrices[props.data.id];
});
</script>

<style lang="less" scoped>
.market-item-box {
  padding: 0 5px 5px;
  margin-bottom: 10px;
  border-bottom: solid 1px var(--el-border-color);
}

.market-item-header {
  display: flex;
  align-items: center;
}

.market-item-name {
  font-size: 20px;
  font-weight: bold;
}

.market-item-body {
  margin-top: 5px;
}
</style>
