<template>
  <el-container class="h100">
    <el-header class="pl0 pr0" style="height: auto;">
      <AbstractionTab v-model="tab" />
    </el-header>
    <el-main v-if="tab === 0" class="pl0 pr0 pb0">
      <AbstractionSellTable />
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
import { ElContainer, ElHeader, ElMain } from "element-plus";
import { ref } from "vue";
import AbstractionSellTable from "./AbstractionSellTable.vue";
import AbstractionTab from "./AbstractionTab.vue";
import "element-plus/es/components/container/style/css";

const tab = ref(0);
</script>
