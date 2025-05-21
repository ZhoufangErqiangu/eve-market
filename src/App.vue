<template>
  <el-config-provider :locale="elementLocale">
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
  </el-config-provider>
</template>

<script lang="ts" setup>
import { ElConfigProvider, ElContainer, ElFooter, ElHeader, ElMain } from "element-plus";
import "element-plus/es/components/container/style/css";
import en from "element-plus/es/locale/lang/en";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import MainFooter from "./components/layout/LayoutFooter.vue";
import MainHeader from "./components/layout/LayoutHeader.vue";

const { locale } = useI18n();
const elementLocale = computed(() => {
  switch (locale.value) {
    case "zh-CN":
      return zhCn;
    case "en-US":
      return en;
    default:
      return zhCn;
  }
});
</script>
