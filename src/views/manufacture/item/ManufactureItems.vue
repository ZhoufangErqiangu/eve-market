<template>
  <div class="manufacture-items">
    <div class="source">
      <div class="title">
        {{ $t("manufacture.items.purchase") }}
      </div>
      <div class="list">
        <ManufactureItem v-for="i of items.purchase" :key="i.type" :data="i" @source="onSource" />
      </div>
    </div>
    <div class="source">
      <div class="title">
        {{ $t("manufacture.items.manufacture") }}
      </div>
      <div class="list">
        <ManufactureItem v-for="i of items.manufacture" :key="i.type" :data="i" @source="onSource" />
      </div>
    </div>
    <div class="source">
      <div class="title">
        {{ $t("manufacture.items.original") }}
      </div>
      <div class="list">
        <ManufactureItem v-for="i of items.original" :key="i.type" :data="i" @source="onSource" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { type ManufactureItemSource, type ManufactureItemType } from "..";
import ManufactureItem from "./ManufactureItem.vue";

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

const items = computed(() => {
  const res: Record<ManufactureItemSource, ManufactureItemType[]> = {
    manufacture: [],
    purchase: [],
    original: [],
  };

  for (const item of props.data) {
    if (item.source === "manufacture") {
      res.manufacture.push(item);
    } else if (item.source === "purchase") {
      res.purchase.push(item);
    } else if (item.source === "original") {
      res.original.push(item);
    } else {
      console.warn("Unknown source", item);
    }
  }

  return res;
});
</script>

<style lang="less" scoped>
.manufacture-items {
  .source+.source {
    margin-top: 5px;
  }

  .list {
    margin-top: 5px;

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    row-gap: 10px;
    column-gap: 10px;
  }
}
</style>
