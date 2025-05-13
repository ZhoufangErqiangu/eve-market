<template>
  <div v-loading="headerLoading" class="market-order-header">
    <h2>
      {{ name }}
    </h2>
    <MarketRegion />
  </div>
  <div v-loading="bodyLoading" class="market-order-body">
    <MarketOrdersTable :header="$t('market.orders.ask')" :orders="sellOrders"
      :sort="{ prop: 'price', order: 'ascending' }" />
    <MarketOrdersTable :header="$t('market.orders.bid')" :orders="buyOrders"
      :sort="{ prop: 'price', order: 'descending' }" />
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useConfigStore } from "../../../stores/config";
import { type MarketOrder, useDataStore } from "../../../stores/data";
import MarketOrdersTable from "./MarketOrdersTable.vue";
import MarketRegion from "./MarketRegion.vue";

const props = defineProps({
  type: {
    type: Number,
    required: true,
  },
});

const { t } = useI18n();
const configStore = useConfigStore();
const dataStore = useDataStore();

const headerLoading = ref(false);
const bodyLoading = ref(false);
const name = ref(t("market.orders.header.loading"));
const buyOrders = ref<MarketOrder[]>([]);
const sellOrders = ref<MarketOrder[]>([]);

async function initHeader() {
  if (headerLoading.value) return;
  try {
    headerLoading.value = true;
    const ns = await dataStore.readNames([props.type]);
    name.value = ns[props.type] ?? t("market.orders.header.unknown");
  } catch (err) {
    console.error("init header error", err);
    ElMessage.error("Init error");
  }
  headerLoading.value = false;
}
async function initBody() {
  if (bodyLoading.value) return;
  try {
    bodyLoading.value = true;
    const mos = await dataStore.readMarketOrders(configStore.marketRegion, props.type);
    buyOrders.value = mos.filter((mo) => mo.isBuy);
    sellOrders.value = mos.filter((mo) => !mo.isBuy);
  } catch (err) {
    console.error("init header error", err);
    ElMessage.error("Init error 2");
  }
  bodyLoading.value = false;
}

watch(
  () => props.type,
  () => {
    initHeader();
    initBody();
  },
  { immediate: true },
);
watch(
  () => configStore.marketRegion,
  () => {
    initBody();
  },
);
</script>

<style lang="less" scoped>
.market-order-header {
  display: flex;
  justify-content: space-between;

  h2 {
    margin: 0;
  }
}

.market-order-body {
  margin-top: 5px;
  flex: 1;
  overflow: hidden;
}
</style>
