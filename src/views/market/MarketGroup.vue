<template>
  <div v-if="marketGroups" class="market-group-box">
    <MarketGroupItem v-for="g in marketGroups" :key="g.market_group_id" :item="g" @group="onGroup" @type="onType" />
  </div>
  <div v-else class="market-group-empty">
    <p class="market-group-empty-text">
      {{ $t("Cache is empty, you need to init.") }}
    </p>
  </div>
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

<style lang="less" scoped>
.market-group-empty {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
