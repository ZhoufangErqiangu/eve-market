<template>
  <el-form :model="form" label-width="120px">
    <el-form-item :label="$t('Data source')" prop="dataSource">
      <el-select v-model="form.dataSource" :clearable="true">
        <el-option v-for="o in DataSourceJson" :key="o.value" :label="o.label" :value="o.value" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('Router')" prop="router">
      <el-select v-model="form.router" :clearable="true">
        <el-option v-for="o in RouterJson" :key="o.value" :label="o.label" :value="o.value" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSave">
        {{ $t('Save') }}
      </el-button>
      <el-button @click="onReset">
        {{ $t('Reset') }}
      </el-button>
    </el-form-item>
  </el-form>
  <el-collapse>
    <el-collapse-item :title="$t('Danger')" name="danger">
      <el-button type="danger" @click="onDelete">
        Delete all data
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
import DataSourceJson from "../../assets/json/datasource.json";
import RouterJson from "../../assets/json/router.json";
import { useConfigStore } from "../../stores/config";
import { MARKET_GROUP_KEY } from "../../utils/market";
import { PRICE_KEY } from "../../utils/price";

const configStore = useConfigStore();
const form = ref({
  dataSource: configStore.dataSource,
  router: configStore.router
});

function onSave() {
  configStore.setConfig(form.value);
  ElMessage.success("Save success");
}
function onReset() {
  form.value.dataSource = configStore.dataSource;
  form.value.router = configStore.router;
}

const deleteDBLoading = ref(false);
async function onDelete() {
  if (deleteDBLoading.value) {
    return;
  }
  if (!confirm("Are you sure to delete database?")) {
    return;
  }
  try {
    deleteDBLoading.value = true;
    localStorage.removeItem(MARKET_GROUP_KEY);
    localStorage.removeItem(PRICE_KEY);
    window.location.reload();
  } catch (err) {
    console.error("delete db error", err);
    ElMessage.error("Delete database error");
  }
  deleteDBLoading.value = false;
}
</script>

<style lang="less" scoped></style>
