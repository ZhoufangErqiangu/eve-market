<template>
  <el-container class="h100">
    <el-aside>
      <MarketGroups @group="onGroup" @type="onType" />
    </el-aside>
    <el-main class="pa0">
      <el-container class="h100">
        <el-header class="market-view-header">
          <el-form :inline="true" label-position="left">
            <el-form-item :label="$t('Region')" style="margin-right: 0; margin-bottom: 0;">
              <el-select v-model="configStore.marketRegion" style="width: 120px;" placeholder="Select Region"
                class="w100">
                <el-option v-for="group of regionOptions" :key="group.value" :label="group.label"
                  :value="group.value" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-header>
        <el-main class="market-view-body pa0">
          <el-tabs v-model="activeTab" class="h100">
            <el-tab-pane class="pane-order" :label="$t('Order')" name="order">
              <MarketOrders v-if="activeType" :region="configStore.marketRegion" :type="activeType" />
              <el-empty v-else :description="$t('Please select a type')" />
            </el-tab-pane>
            <el-tab-pane class="pane-group" :label="$t('Group')" name="group">
              <MarketItems :data="activeGroup?.types" />
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ElAside, ElContainer, ElEmpty, ElHeader, ElMain, ElTabPane, ElSelect, ElOption, ElTabs, ElForm, ElFormItem } from "element-plus";
import "element-plus/es/components/container/style/css";
import "element-plus/es/components/empty/style/css";
import "element-plus/es/components/select/style/css";
import "element-plus/es/components/option/style/css";
import "element-plus/es/components/form/style/css";
import "element-plus/es/components/form-item/style/css";
import "element-plus/es/components/tab-pane/style/css";
import "element-plus/es/components/tabs/style/css";
import { computed, ref } from "vue";
import { type MarketGroup, useDataStore } from "../../stores/data";
import MarketGroups from "./MarketGroups.vue";
import MarketItems from "./MarketItems.vue";
import MarketOrders from "./MarketOrders.vue";
import { useConfigStore } from "../../stores/config";

const dataStore = useDataStore();
const configStore = useConfigStore();

const activeTab = ref("group");
const activeGroup = ref<MarketGroup>();
const activeType = ref(0);

const regionOptions = computed(() => {
  return dataStore.regions.map((region) => ({
    value: region.id,
    label: region.name,
  }));
});

function onGroup(id: number) {
  activeTab.value = "group";
  activeGroup.value = dataStore.marketGroups.find((mg) => mg.id === id);
  activeType.value = 0;
}
function onType(id: number, group: number) {
  activeTab.value = "order";
  activeGroup.value = dataStore.marketGroups.find((mg) => mg.id === group);
  activeType.value = id;
}
</script>

<style lang="less" scoped>
.market-view-header {
  height: auto;
}

.market-view-body {

  .pane-order,
  .pane-group {
    height: 100%;
    overflow: hidden;
  }

  .pane-order {
    display: flex;
    flex-direction: column;
  }
}
</style>
