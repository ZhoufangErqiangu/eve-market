<template>
  <div v-loading="headerLoading" class="market-order-header">
    <h2>
      {{ name }}
    </h2>
  </div>
  <div v-loading="bodingLoading" class="market-order-body">
    <MarketOrdersTable header="Ask" :orders="sellOrders" :sort="{ prop: 'price', order: 'ascending' }" />
    <MarketOrdersTable header="Bid" :orders="buyOrders" :sort="{ prop: 'price', order: 'descending' }" />
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { ref, watch } from "vue";
import { type MarketOrder, useDataStore } from "../../stores/data";
import MarketOrdersTable from "./MarketOrdersTable.vue";

const props = defineProps({
  type: {
    type: Number,
    required: true,
  },
  region: {
    type: Number,
    required: true,
  },
});

const dataStore = useDataStore();

const headerLoading = ref(false);
const bodingLoading = ref(false);
const name = ref("Loading");
const buyOrders = ref<MarketOrder[]>([]);
const sellOrders = ref<MarketOrder[]>([]);

async function initHeader() {
  if (headerLoading.value) return;
  try {
    headerLoading.value = true;
    const ns = await dataStore.readNames([props.type]);
    name.value = ns[props.type];
  } catch (err) {
    console.error("init header error", err);
    ElMessage.error("Init error");
  }
  headerLoading.value = false;
}
async function initBody() {
  if (bodingLoading.value) return;
  try {
    bodingLoading.value = true;
    const mos = await dataStore.readMarketOrders(props.region, props.type);
    buyOrders.value = mos.filter((mo) => mo.isBuy);
    sellOrders.value = mos.filter((mo) => !mo.isBuy);
  } catch (err) {
    console.error("init header error", err);
    ElMessage.error("Init error 2");
  }
  bodingLoading.value = false;
}

watch(
  () => props.type,
  () => {
    initHeader();
    initBody();
  },
  { immediate: true }
);
watch(
  () => props.region,
  () => {
    initBody();
  },
);
</script>

<style lang="less" scoped>
.market-order-body {
  flex: 1;
  overflow: hidden;
}
</style>
