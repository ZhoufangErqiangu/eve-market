<template>
  <div class="market-types">
    <MarketTypeItem v-for="t of props.data" :key="t.id" :data="t" @type="onType" />
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from "vue";
import { type MarketType } from "../../../stores/data";
import MarketTypeItem from "./MarketType.vue";

const props = defineProps({
  data: {
    type: Array as PropType<Array<MarketType>>,
    default: () => [],
  },
});
const emits = defineEmits(["type"]);

function onType(type: MarketType) {
  emits("type", type);
}
</script>
