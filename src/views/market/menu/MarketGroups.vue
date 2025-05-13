<template>
  <div class="market-groups">
    <MarketGroup v-for="mg of dataStore.marketGroups" :key="mg.id" :data="mg" @group="onGroup" @type="onType" />
  </div>
</template>

<script lang="ts" setup>
import { useDataStore } from "../../../stores/data";
import MarketGroup from "./MarketGroup.vue";

const emits = defineEmits(["group", "type"]);

const dataStore = useDataStore();

function onGroup(id: number) {
  emits("group", id);
}
function onType(id: number, group: number) {
  emits("type", id, group);
}
</script>

<style lang="less" scoped>
.market-groups {
  width: 300px;
}
</style>
