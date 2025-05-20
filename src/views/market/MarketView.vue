<template>
  <el-container class="h100">
    <el-aside>
      <MarketGroups @group="onGroup" @type="onType" />
    </el-aside>
    <el-main class="pt0 pb0 pr0">
      <el-tabs v-model="activeTab" class="h100">
        <el-tab-pane class="pane-order pane-order-current" :label="$t('market.orders.label')" name="order">
          <MarketOrders v-if="activeType" :type="activeType" />
          <el-empty v-else :description="$t('market.orders.empty')" />
        </el-tab-pane>
        <el-tab-pane class="pane-group" :label="$t('market.items.label')" name="group">
          <MarketItems :data="activeGroup?.types" @type="onItemsType" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ElAside, ElContainer, ElEmpty, ElMain, ElTabPane, ElTabs } from "element-plus";
import "element-plus/es/components/container/style/css";
import "element-plus/es/components/empty/style/css";
import "element-plus/es/components/tab-pane/style/css";
import "element-plus/es/components/tabs/style/css";
import { ref } from "vue";
import { type MarketGroup, type MarketType, useDataStore } from "../../stores/data";
import MarketItems from "./item/MarketItems.vue";
import MarketGroups from "./menu/MarketGroups.vue";
import MarketOrders from "./order/MarketOrders.vue";

const dataStore = useDataStore();

const activeTab = ref("group");
const activeGroup = ref<MarketGroup>();
const activeType = ref<MarketType>();

function onGroup(group: number) {
  activeTab.value = "group";
  activeGroup.value = dataStore.readMarketGroup(group);
  activeType.value = undefined;
}
function onType(type: MarketType, group: number) {
  activeTab.value = "order";
  activeGroup.value = dataStore.readMarketGroup(group);
  activeType.value = type;
}
function onItemsType(type: MarketType) {
  activeTab.value = "order";
  activeType.value = type;
}
</script>

<style lang="less" scoped>
.pane-order {
  height: 100%;
  overflow: hidden;
}

.pane-order-current {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pane-order-history {
  height: 100%;
  overflow: hidden;
}

.pane-group {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
