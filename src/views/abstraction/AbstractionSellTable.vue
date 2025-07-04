<template>
  <el-table :data="d" height="100%">
    <el-table-column :label="$t('Name')" prop="name" />
    <!--  -->
  </el-table>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useDataStore } from "../../stores/data";
import { ElTable, ElTableColumn } from "element-plus";
import "element-plus/es/components/table/style/css";
import "element-plus/es/components/table-column/style/css";

const dataStore = useDataStore();

const d = computed(() => {
  return dataStore.materials.map(m => {
    return {
      id: m.id,
      name: m.name,
    };
  });
});
</script>
