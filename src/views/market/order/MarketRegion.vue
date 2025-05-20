<template>
  <div class="market-region">
    <label class="label">
      {{ $t('market.region.label') }}
    </label>
    <el-select v-model="configStore.marketRegion" style="width: 120px;" placeholder="Select Region" class="w100">
      <el-option v-for="group of configStore.marketRegionOptions" :key="group.value" :label="group.label"
        :value="group.value" />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ElOption, ElSelect } from "element-plus";
import "element-plus/es/components/option/style/css";
import "element-plus/es/components/select/style/css";
import { useConfigStore } from "../../../stores/config";

const configStore = useConfigStore();
</script>

<style lang="less" scoped>
.market-region {
  display: flex;
  align-items: center;

  .label {
    margin-right: 12px;
    color: var(--el-text-color-regular);
    font-size: var(--el-form-label-font-size);
  }
}
</style>
