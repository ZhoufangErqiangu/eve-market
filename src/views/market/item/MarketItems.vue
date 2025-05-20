<template>
  <MarketItem v-for="t in props.data" :key="t.id" :data="t" @type="onType" />
</template>

<script lang="ts" setup>
import { type PropType } from "vue";
import { type MarketType } from "../../../stores/data";
import MarketItem from "./MarketItem.vue";

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

<style lang="less" scoped></style>
