<template>
  <MarketItem v-for="t in types" :key="t.type_id" :item="t" @type="() => emits('type', t.type_id)" />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import MarketItem from "./MarketItem.vue";
import { type UniverseType } from "../../apis/esi/universe";
import { type MarketGroup2, getMarketGroupFromLocal } from "../../utils/market";
import { getType } from "../../utils/type";

const props = defineProps({
  groupId: {
    type: Number,
    required: true,
  },
});
const emits = defineEmits(["type"]);

const types = ref<UniverseType[]>([]);
const mgs = getMarketGroupFromLocal();

async function init(id: number) {
  if (!mgs) return;
  function find(mg: MarketGroup2[], id: number): MarketGroup2 | undefined {
    for (const g of mg) {
      if (g.market_group_id === id) return g;
      if (g.children) {
        const f = find(g.children, id);
        if (f) return f;
      }
    }
  }
  const mg = find(mgs, id);
  if (!mg?.types) return;
  const ts: UniverseType[] = [];
  for (const tid of mg.types) {
    const t = await getType(tid);
    if (!t) continue;
    ts.push(t);
  }
  types.value = ts;
}
watch(() => props.groupId, (val, oldVal) => {
  if (val === oldVal) return;
  if (!val) return;
  void init(val);
}, { immediate: true });
</script>

<style lang="less" scoped></style>
