<template>
  <div class="footer-box">
    <el-space alignment="middle">
      <p class="text1">
        Powered by ZhoufangErqiangu
      </p>
      <p>
        <a href="https://github.com/ZhoufangErqiangu/eve-market" target="_blank">
          <img class="icon" src="/img/github.svg" alt="GitHub">
        </a>
      </p>
    </el-space>
  </div>
</template>

<script lang="ts" setup>
import { ElSpace } from "element-plus";
import "element-plus/es/components/space/style/css";
</script>

<style lang="less" scoped>
.footer-box {
  text-align: center;

  p {
    margin: 0;
  }
}

.text1 {
  text-align: center;
}

.icon {
  object-fit: contain;
}
</style>
