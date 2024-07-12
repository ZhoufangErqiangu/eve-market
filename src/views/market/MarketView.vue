<template>
  <el-container class="h100">
    <el-aside>
      <MarketGroup @group="onGroup" @type="onType" />
    </el-aside>
    <el-main>
      <el-tabs v-model="activeTab" class="market-tabs">
        <el-tab-pane class="pane-order" :label="$t('Order')" name="order">
          <MarketOrder v-if="activeType" :type-id="activeType" />
          <div v-else class="market-type-empty">
            <p class="market-type-empty-text">
              {{ $t('Please select a type') }}
            </p>
          </div>
        </el-tab-pane>
        <el-tab-pane class="pane-group" :label="$t('Group')" name="group">
          <MarketList :group-id="activeGroup" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ElAside, ElContainer, ElMain, ElTabs, ElTabPane } from "element-plus";
import "element-plus/es/components/container/style/css";
import "element-plus/es/components/tabs/style/css";
import "element-plus/es/components/tab-pane/style/css";
import { ref } from "vue";
import MarketGroup from "./MarketGroup.vue";
import MarketList from "./MarketList.vue";
import MarketOrder from "./MarketOrder.vue";

const activeTab = ref("group");
const activeGroup = ref(0);
const activeType = ref(0);

function onGroup(id: number) {
  activeTab.value = "group";
  activeGroup.value = id;
  activeType.value = 0;
}
function onType(id: number, groupId: number) {
  activeTab.value = "order";
  activeGroup.value = groupId;
  activeType.value = id;
}
</script>

<style lang="less" scoped>
.market-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;

  :deep(.el-tabs__content) {
    flex: 1;
    overflow: hidden;
  }
}

.pane-order {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.pane-group {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.market-type-empty {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.market-type-empty-text {
  font-size: 20px;
  font-weight: bold;
}
</style>
