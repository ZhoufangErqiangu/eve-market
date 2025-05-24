<template>
  <div class="manufacture-product-route">
    <ManufacturePath v-for="m of props.data" :key="m.type" :data="m" @source="onSource" />
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from "vue";
import { type ManufactureItemSource, type ManufactureItemType } from "..";
import ManufacturePath from "../path/ManufacturePath.vue";

const props = defineProps({
  data: {
    type: Array as PropType<Array<ManufactureItemType>>,
    default: () => [],
  },
});
const emits = defineEmits(["source"]);

function onSource(type: number, source: ManufactureItemSource) {
  emits("source", type, source);
}
</script>

<style lang="less" scoped></style>
