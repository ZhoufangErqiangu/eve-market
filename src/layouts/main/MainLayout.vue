<template>
  <el-container class="h100">
    <el-header>
      <MainHeader />
    </el-header>
    <el-main>
      <router-view />
    </el-main>
    <el-footer style="height: auto;">
      <MainFooter />
    </el-footer>
  </el-container>
</template>

<script lang="ts" setup>
import { ElContainer, ElFooter, ElHeader, ElMain } from "element-plus";
import "element-plus/es/components/container/style/css";
import MainFooter from "./MainFooter.vue";
import MainHeader from "./MainHeader.vue";
</script>

<style lang="less" scoped></style>
