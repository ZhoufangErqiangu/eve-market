<template>
  <el-card :header="$t('Init')">
    <p>
      {{ $t('InitDesc') }}
    </p>
    <div>
      <el-button type="primary" :loading="initLoading" @click="onInit">
        {{ $t('Init') }}
      </el-button>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { ElButton, ElCard, ElMessage } from "element-plus";
import "element-plus/es/components/button/style/css";
import "element-plus/es/components/card/style/css";
import { ref } from "vue";
import { useDataStore } from "../../stores/data";

const dataStore = useDataStore();

const initLoading = ref(false);
async function onInit() {
  if (initLoading.value) return;
  try {
    initLoading.value = true;
    await dataStore.readMarketGroups();
    await dataStore.readRegions();
  } catch (err) {
    console.error("init error", err);
    ElMessage.error("Init error");
  }
  initLoading.value = false;
}
</script>

<style lang="less" scoped></style>
