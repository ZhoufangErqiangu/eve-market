<template>
  <MarketItem v-for="t in types" :key="t.id" :data="t" @type="onType" />
</template>

<script lang="ts" setup>
import { type PropType, ref, watch } from "vue";
import { useDataStore } from "../../../stores/data";
import MarketItem from "./MarketItem.vue";

interface MarketType {
  id: number;
  name: string;
}

const props = defineProps({
  data: {
    type: Array as PropType<Array<number>>,
    default: () => [],
  },
});
const emits = defineEmits(["type"]);

const dataStore = useDataStore();

const types = ref<Array<MarketType>>(props.data.map((t) => ({ id: t, name: t.toString() })));

async function readNames() {
  const ns = await dataStore.readNames(props.data);
  types.value = props.data.map((t) => ({ id: t, name: ns[t] ?? t.toString() }));
}
watch(() => props.data, (val, oldVal) => {
  if (val === oldVal) return;
  if (!val) return;
  void readNames();
}, { immediate: true });

function onType(id: number) {
  emits("type", id);
}
</script>

<style lang="less" scoped></style>
