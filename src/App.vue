<template>
  <el-container class="h100">
    <router-view />
  </el-container>
</template>

<script lang="ts" setup>
import { ElContainer } from "element-plus";
import "element-plus/es/components/container/style/css";

fetch("/version.json",).then(async res => {
  const vv: { version: string } = await res.json();
  console.log("front version", vv.version);
}).catch(err => {
  console.error("get front version error", err);
});
</script>
