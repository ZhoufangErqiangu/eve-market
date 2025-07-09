<template>
  <el-table v-loading="loading" :data="dd" height="100%">
    <el-table-column :label="$t('Name')" prop="name" />
    <el-table-column :label="$t('Ore price')" prop="priceOre"
      :formatter="(row: SellData) => priceFormatter(row.priceOre)" :sortable="true" />
    <el-table-column :label="$t('Mineral price')" prop="priceMineral"
      :formatter="(row: SellData) => priceFormatter(row.priceMineral)" :sortable="true" />
    <el-table-column :label="$t('Ratio')" prop="ratio" :formatter="(row: SellData) => percentFormatter(row.ratio)"
      :sortable="true" />
  </el-table>
</template>

<script lang="ts" setup>
import { ElMessage, ElTable, ElTableColumn } from "element-plus";
import "element-plus/es/components/table-column/style/css";
import "element-plus/es/components/table/style/css";
import { computed, ref } from "vue";
import { useDataStore } from "../../stores/data";

const props = defineProps({
  region: {
    type: Number,
    required: true,
  },
  abstractionPercent: {
    type: Number,
    default: () => 0.0,
  },
});

const dataStore = useDataStore();

interface SellData {
  id: number;
  name: string;
  priceOre: number;
  priceMineral: number;
  ratio: number;
}

const loading = ref(false);
const data = ref<Array<SellData>>([]);
async function initData() {
  loading.value = true;
  try {
    const rr: Array<SellData> = [];

    const priceCache: Map<number, number> = new Map();
    const readPrice = async (id: number) => {
      if (priceCache.has(id)) {
        return priceCache.get(id);
      } else {
        // read ore orders
        const oos = await dataStore.readMarketOrders(props.region, id, "buy");
        const o = oos.reduce<number>((prev, curr) => {
          if (!prev) return curr.price;
          else if (curr.price > prev) return curr.price;
          else return prev;
        }, 0);

        // set to cache
        priceCache.set(id, o);
        return o;
      }
    };

    for (const m of dataStore.materials) {
      // read ore orders
      const op = await readPrice(m.id);

      // read abstract mineral
      const tp = dataStore.typePortions[m.id];
      if (!tp) {
        console.warn("type protion not found", m.id);
        continue;
      }

      // read all order
      let mp = 0;
      for (const mm of tp.materials) {
        const mmp = await readPrice(mm.id);
        if (!mmp) continue;
        mp += mmp * mm.quantity / tp.quantity;
      }

      rr.push({
        id: m.id,
        name: m.name,
        priceOre: op ?? 0.0,
        priceMineral: mp,
        ratio: 0,
      });
    };

    data.value = rr;
  } catch (err) {
    console.error("init error", err);
    ElMessage.error("Init error");
  }
  loading.value = false;
}
void initData();

const dd = computed(() => {
  return data.value.map((d) => {
    const mp = d.priceMineral * props.abstractionPercent / 100.0;
    return {
      ...d,
      priceMineral: mp,
      ratio: d.priceOre > 0 ? mp / d.priceOre : 0.0,
    };
  });
});

function priceFormatter(value: number) {
  return value.toFixed(2);
}
function percentFormatter(value: number) {
  return `${(value * 100.0).toFixed(2)}%`;
}
</script>
