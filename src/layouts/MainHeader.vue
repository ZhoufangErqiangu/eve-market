<template>
  <el-row class="box1 h100" justify="space-between" align="middle">
    <el-col class="box11" :span="6">
      <h1>
        {{ $t(layoutStore.title) }}
      </h1>
    </el-col>
    <el-col class="box12" :span="18">
      <el-space alignment="center">
        <el-menu class="menu h100" :router="true" mode="horizontal" :default-active="defaultPath" :ellipsis="false">
          <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path" :route="item.path">
            {{ $t(item.label) }}
          </el-menu-item>
        </el-menu>
        <LanguageSelect v-model="lang" @change="onLangChange" />
        <el-switch v-model="layoutStore.isDark" :active-action-icon="MoonNight" :inactive-action-icon="Sunny" />
      </el-space>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { MoonNight, Sunny } from "@element-plus/icons-vue";
import { ElCol, ElMenu, ElMenuItem, ElRow, ElSpace, ElSwitch } from "element-plus";
import "element-plus/es/components/button/style/css";
import "element-plus/es/components/col/style/css";
import "element-plus/es/components/menu-item/style/css";
import "element-plus/es/components/menu/style/css";
import "element-plus/es/components/row/style/css";
import "element-plus/es/components/space/style/css";
import "element-plus/es/components/switch/style/css";
import { ref } from "vue";
import LanguageSelect from "../components/LanguageSelect.vue";
import { defaultLang, setLang } from "../locale";
import { useLayoutStore } from "../stores/layout";
import { useRoute } from "vue-router";

const layoutStore = useLayoutStore();
const route = useRoute();

const defaultPath = route.path;
interface MenuItem {
  label: string
  path: string
}
const menuItems: MenuItem[] = [
  { label: "Home", path: "/home" },
  { label: "Market", path: "/market" },
  { label: "Config", path: "/config" },
];

const lang = ref(localStorage.getItem("lang") ?? defaultLang);
function onLangChange(val: string) {
  setLang(val);
}
</script>

<style lang="less" scoped>
.box1 {
  border-bottom: 1px solid var(--el-border-color);
}

.box11 {
  height: 100%;

  h1 {
    height: 100%;
  }
}

.box12 {
  text-align: end;
}

.menu {
  border-bottom: none;
}
</style>
