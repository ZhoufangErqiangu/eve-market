<template>
  <MarketGroupItem v-for="g in marketGroups" :key="g.market_group_id" :item="g" @group="onGroup" @type="onType" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { getMarketGroupFromLocal, type MarketGroup2 } from "../../utils/market";
import MarketGroupItem from "./MarketGroupItem.vue";

const emits = defineEmits(["group", "type"]);

const marketGroups = ref<MarketGroup2[] | undefined>(getMarketGroupFromLocal());

function onGroup(id: number) {
  emits("group", id);
}
function onType(id: number, groupId: number) {
  emits("type", id, groupId);
}
</script>

<style lang="less" scoped></style>
