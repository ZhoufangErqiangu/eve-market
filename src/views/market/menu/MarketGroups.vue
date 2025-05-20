<template>
  <div class="market-groups">
    <MarketGroup v-for="mg of dataStore.marketGroups" :key="mg.id" :data="mg" @group="onGroup" @type="onType" />
  </div>
</template>

<script lang="ts" setup>
import { useDataStore, type MarketType } from "../../../stores/data";
import MarketGroup from "./MarketGroup.vue";

const emits = defineEmits(["group", "type"]);

const dataStore = useDataStore();

function onGroup(group: number) {
  emits("group", group);
}
function onType(type: MarketType, group: number) {
  emits("type", type, group);
}
</script>

<style lang="less" scoped>
.market-groups {
  width: 300px;
}
</style>
