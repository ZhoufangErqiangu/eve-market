<template>
  <div class="manufacture-item" :class="recusionClass">
    <div class="type">
      <div class="name">
        {{ name }}
      </div>
      <div class="quantity">
        {{ quanity }}
      </div>
    </div>
    <div class="isk">
      <div class="text1">
        {{ $t("manufacture.item.value") }}
      </div>
      <div class="text2">
        {{ value }}
      </div>
    </div>
    <ItemSource class="source" :data="props.data" @source="onSource" />
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import { type ManufactureItemType } from "..";
import { useDataStore } from "../../../stores/data";
import { formatNumber } from "../../../utils/math";
import ItemSource from "../ManufactureSource.vue";

const props = defineProps({
  data: {
    type: Object as PropType<ManufactureItemType>,
    required: true,
  },
});
const emits = defineEmits(["source"]);

const { t } = useI18n();
const dataStroe = useDataStore();

const name = computed(() => {
  if (!props.data.type) return t("Unknown");
  return dataStroe.types[props.data.type.toString()] || t("Unknown");
});
const quanity = computed(() => {
  return Math.ceil(props.data.quantity).toLocaleString("en-US");
});

function onSource(type: string, source: string) {
  emits("source", type, source);
}

const value = computed(() => {
  return formatNumber(props.data.quantity * props.data.price);
});

const recusionClass = computed(() => {
  return [`recursion-${props.data.recursion % 3}`];
});
</script>

<style lang="less" scoped>
.manufacture-item {
  padding: 10px;
  box-sizing: border-box;

  border: solid 1px var(--border-color);
  border-radius: var(--el-border-radius-base);
  --border-color: var(var(--el-border-color));

  &.recursion-0 {
    --border-color: #ffd700;
  }

  &.recursion-1 {
    --border-color: #da70d6;
  }

  &.recursion-2 {
    --border-color: #179fff;
  }

  .type {
    display: flex;
    justify-content: space-between;
  }

  .isk {
    margin-top: 5px;

    display: flex;
    justify-content: space-between;
  }

  .source {
    margin-top: 5px;
  }
}
</style>
