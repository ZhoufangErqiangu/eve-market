<template>
  <div class="market-types">
    <MarketType v-for="t of types" :key="t.id" :data="t" @type="onType" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, type PropType, ref } from "vue";
import { useDataStore } from "../../../stores/data";
import MarketType from "./MarketType.vue";

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

function onType(id: number) {
  emits("type", id);
}

const types = ref<Array<MarketType>>(props.data.map((t) => ({ id: t, name: t.toString() })));
async function readNames() {
  const ns = await dataStore.readNames(props.data);
  types.value = props.data.map((t) => ({ id: t, name: ns[t] ?? t.toString() }));
}
onMounted(readNames);
</script>
