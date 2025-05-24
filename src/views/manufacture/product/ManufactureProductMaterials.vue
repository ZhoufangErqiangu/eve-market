<template>
  <div class="manufacture-product-materials">
    <div class="source">
      <div class="title">
        {{ $t("manufacture.product.materials.purchase") }}
      </div>
      <div class="list">
        <ManufactureItem v-for="i of items.purchase" :key="i.type" :data="i" @source="onSource" />
      </div>
    </div>
    <div class="source">
      <div class="title">
        {{ $t("manufacture.product.materials.original") }}
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
import ManufactureItem from "../item/ManufactureItem.vue";

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
      // skip manufacture item
      continue;
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
.manufacture-product-materials {
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
