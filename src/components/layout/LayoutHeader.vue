<template>
  <el-row class="layout-header" justify="space-between" align="middle">
    <el-col :span="6">
      <h1 style="margin: 0;">
        {{ layoutStore.headerTitle }}
      </h1>
    </el-col>
    <el-col class="box2" :span="18">
      <el-space class="h100" alignment="center">
        <el-menu class="menu" :router="true" mode="horizontal" :default-active="route.path" :ellipsis="false">
          <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path" :route="item.path">
            {{ $t(item.label) }}
          </el-menu-item>
        </el-menu>
        <LanguageSelect v-model="lang" />
        <el-switch v-model="layoutStore.isDark" :active-action-icon="MoonNight" :inactive-action-icon="Sunny" />
      </el-space>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { MoonNight, Sunny } from "@element-plus/icons-vue";
import { ElCol, ElMenu, ElMenuItem, ElRow, ElSpace, ElSwitch } from "element-plus";
import "element-plus/es/components/col/style/css";
import "element-plus/es/components/menu-item/style/css";
import "element-plus/es/components/menu/style/css";
import "element-plus/es/components/row/style/css";
import "element-plus/es/components/space/style/css";
import "element-plus/es/components/switch/style/css";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import LanguageSelect from "../../components/LanguageSelect.vue";
import { LANG_KEY } from "../../locale";
import { useLayoutStore } from "../../stores/layout";

const layoutStore = useLayoutStore();
const route = useRoute();

interface MenuItem {
  label: string
  path: string
}
const menuItems: MenuItem[] = [
  { label: "layout.header.menu.home", path: "/" },
  { label: "layout.header.menu.market", path: "/market" },
  { label: "layout.header.menu.manufacture", path: "/manufacture" },
  { label: "layout.header.menu.abstraction", path: "/abstraction" },
  { label: "layout.header.menu.config", path: "/config" },
];

const i18n = useI18n();
const lang = computed({
  get: () => i18n.locale.value,
  set: (val) => {
    i18n.locale.value = val;
    localStorage.setItem(LANG_KEY, val);
  },
});
</script>

<style lang="less" scoped>
.layout-header {
  height: 100%;
  border-bottom: 1px solid var(--el-border-color);

  .box2 {
    height: 100%;
    text-align: end;
  }

  .menu {
    height: 100%;
    border-bottom: none;
  }
}
</style>
