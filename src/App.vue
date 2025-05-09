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
import MainFooter from "./components/layout/LayoutFooter.vue";
import MainHeader from "./components/layout/LayoutHeader.vue";
</script>
