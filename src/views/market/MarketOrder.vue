<template>
  <div v-loading="headerLoading" class="market-order-header">
    <h2>
      {{ tt?.name ?? 'Loading' }}
    </h2>
  </div>
  <div v-loading="bodingLoading" class="market-order-body">
    <MarketOrderTable header="Ask" :orders="sellOrders" :sort="{ prop: 'price', order: 'ascending' }" />
    <MarketOrderTable header="Bid" :orders="buyOrders" :sort="{ prop: 'price', order: 'descending' }" />
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { ref, watch } from "vue";
import { type MarketOrder } from "../../apis/esi/market";
import { type UniverseType } from "../../apis/esi/universe";
import { getMarketOrder } from "../../utils/market";
import { getType } from "../../utils/type";
import MarketOrderTable from "./MarketOrderTable.vue";

const props = defineProps({
  typeId: {
    type: Number,
    required: true,
  },
});

const headerLoading = ref(false);
const bodingLoading = ref(false);
const tt = ref<UniverseType>();
const buyOrders = ref<MarketOrder[]>([]);
const sellOrders = ref<MarketOrder[]>([]);

async function initHeader(id: number) {
  if (headerLoading.value) return;
  try {
    headerLoading.value = true;
    const t = await getType(id);
    tt.value = t;
  } catch (err) {
    console.error("init header error", err);
    ElMessage.error("Init error");
  }
  headerLoading.value = false;
}
async function initBody(id: number) {
  if (bodingLoading.value) return;
  try {
    bodingLoading.value = true;
    const mos = await getMarketOrder(id);
    buyOrders.value = mos.filter((mo) => mo.is_buy_order);
    sellOrders.value = mos.filter((mo) => !mo.is_buy_order);
  } catch (err) {
    console.error("init header error", err);
    ElMessage.error("Init error 2");
  }
  bodingLoading.value = false;
}

watch(() => props.typeId, (val, oldVal) => {
  if (val === oldVal) return;
  if (!val) return;
  void initHeader(val);
  void initBody(val);
}, { immediate: true });
</script>

<style lang="less" scoped>
.market-order-body {
  flex: 1;
  overflow: hidden;
}
</style>
