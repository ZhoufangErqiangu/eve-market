<template>
  <div class="market-item-box">
    <div class="market-item-header">
      <div class="market-item-name">
        {{ props.item.name }}
      </div>
    </div>
    <div class="market-item-body">
      <el-row :gutter="15">
        <el-col :span="6">
          <MarketItemPrice title="Average price" :price="avg" />
        </el-col>
        <el-col :span="6">
          <MarketItemPrice title="Adjusted price" :price="adj" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElRow, ElCol } from "element-plus";
import "element-plus/es/components/row/style/css";
import "element-plus/es/components/col/style/css";
import { ref, type PropType } from "vue";
import { type UniverseType } from "../../apis/esi/universe";
import { getPrice } from "../../utils/price";
import MarketItemPrice from "./MarketItemPrice.vue";

const props = defineProps({
  item: {
    type: Object as PropType<UniverseType>,
    required: true
  }
});
const avg = ref(0);
const adj = ref(0);

function init() {
  const pp = getPrice(props.item.type_id);
  if (pp) {
    avg.value = pp.average_price ?? 0;
    adj.value = pp.adjusted_price ?? 0;
  }
}
init();
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
