<template>
  <el-form :model="form" label-width="120px">
    <el-form-item :label="$t('config.esi.datasource')" prop="esiDataSource">
      <el-select v-model="form.esiDataSource" :clearable="true">
        <el-option v-for="o in configStore.esiDataSourceOptions" :key="o.value" :label="$t(o.label)" :value="o.value" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSave">
        {{ $t('config.save.btn') }}
      </el-button>
      <el-button @click="onReset">
        {{ $t('config.reset.btn') }}
      </el-button>
    </el-form-item>
  </el-form>
  <el-collapse>
    <el-collapse-item :title="$t('config.danger.title')" name="danger">
      <el-button type="danger" @click="onDelete">
        {{ $t('config.delete.btn') }}
      </el-button>
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="ts" setup>
import { ElButton, ElCollapse, ElCollapseItem, ElForm, ElFormItem, ElMessage, ElOption, ElSelect } from "element-plus";
import "element-plus/es/components/button/style/css";
import "element-plus/es/components/collapse-item/style/css";
import "element-plus/es/components/collapse/style/css";
import "element-plus/es/components/form-item/style/css";
import "element-plus/es/components/form/style/css";
import "element-plus/es/components/option/style/css";
import "element-plus/es/components/select/style/css";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useConfigStore } from "../../stores/config";
import { useDataStore } from "../../stores/data";

const { t } = useI18n();
const configStore = useConfigStore();
const dataStore = useDataStore();

const form = ref({
  esiDataSource: configStore.esiDataSource,
});

function onSave() {
  configStore.esiDataSource = form.value.esiDataSource;
  ElMessage.success(t("config.save.success"));
}
function onReset() {
  form.value.esiDataSource = configStore.esiDataSource;
}
function onDelete() {
  dataStore.deleteData();
  ElMessage.success(t("config.delete.success"));
}
</script>
