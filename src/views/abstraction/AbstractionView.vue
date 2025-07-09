<template>
  <el-container class="h100">
    <el-header class="pl0 pr0" style="height: auto;">
      <el-space>
        <AbstractionTab v-model="tab" />
        <el-input-number v-model="abstractionPercent" :min="0" :max="100" />
      </el-space>
    </el-header>
    <el-main v-if="tab === 0" class="pl0 pr0 pb0">
      <AbstractionSellTable :region="configStore.marketRegion" :abstraction-percent="abstractionPercent" />
    </el-main>
    <el-main v-else-if="tab === 1" class="pl0 pr0 pb0">
      todo, for buy table
    </el-main>
    <el-main v-else class="pl0 pr0 pb0">
      Unknown tab {{ tab }}
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ElContainer, ElHeader, ElInputNumber, ElMain, ElSpace } from "element-plus";
import "element-plus/es/components/container/style/css";
import "element-plus/es/components/input-number/style/css";
import "element-plus/es/components/space/style/css";
import { ref } from "vue";
import { useConfigStore } from "../../stores/config";
import AbstractionSellTable from "./AbstractionSellTable.vue";
import AbstractionTab from "./AbstractionTab.vue";

const configStore = useConfigStore();

const tab = ref(0);
const abstractionPercent = ref(50);
</script>
