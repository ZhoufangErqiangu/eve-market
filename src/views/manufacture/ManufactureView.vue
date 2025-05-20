<template>
  <el-container class="h100">
    <el-header class="pl0 pr0" style="height: auto;">
      <div class="manufacture-header">
        <h2>
          {{ $t("manufacture.title") }}
        </h2>
        <div>
          <el-button type="primary" size="small" @click="onCreate">
            {{ $t("manufacture.create") }}
          </el-button>
          <el-button type="primary" size="small" @click="onSave">
            {{ $t("manufacture.save") }}
          </el-button>
          <el-button size="small" @click="onCancel">
            {{ $t("manufacture.cancel") }}
          </el-button>
          <el-button type="danger" size="small" @click="onDelete">
            {{ $t("manufacture.delete") }}
          </el-button>
        </div>
      </div>
    </el-header>
    <el-main class="pl0 pb0 pr0">
      <!-- todo -->
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ElButton, ElContainer, ElHeader, ElMain } from "element-plus";
import "element-plus/es/components/button/style/css";
import "element-plus/es/components/container/style/css";

function onCreate() {
  // todo
}
function onSave() {
  // todo
}
function onCancel() {
  // todo
}
function onDelete() {
  // todo
}
</script>

<style lang="less" scoped>
.manufacture-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 24px;
  }
}
</style>
