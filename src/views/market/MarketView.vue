<template>
  <el-container class="h100">
    <el-aside>
      <MarketGroups @group="onGroup" @type="onType" />
    </el-aside>
    <el-main class="pt0 pb0 pr0">
      <el-tabs v-model="activeTab" class="h100">
        <el-tab-pane class="pane-order" :label="$t('Order')" name="order">
          <MarketOrders v-if="activeType" :type="activeType" />
          <el-empty v-else :description="$t('Please select a type')" />
        </el-tab-pane>
        <el-tab-pane class="pane-group" :label="$t('Group')" name="group">
          <MarketItems :data="activeGroup?.types" />
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
import { type MarketGroup, useDataStore } from "../../stores/data";
import MarketGroups from "./MarketGroups.vue";
import MarketItems from "./MarketItems.vue";
import MarketOrders from "./MarketOrders.vue";

const dataStore = useDataStore();

const activeTab = ref("group");
const activeGroup = ref<MarketGroup>();
const activeType = ref(0);

function onGroup(id: number) {
  activeTab.value = "group";
  activeGroup.value = dataStore.readMarketGroup(id);
  activeType.value = 0;
}
function onType(id: number, group: number) {
  activeTab.value = "order";
  activeGroup.value = dataStore.readMarketGroup(group);
  activeType.value = id;
}
</script>

<style lang="less" scoped>
.pane-order {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pane-group {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
