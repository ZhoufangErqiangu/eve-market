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
    <el-select v-model="localSource" class="source">
      <el-option v-for="o of sourceOptions" :key="o.value" :label="o.label" :value="o.value" />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ElOption, ElSelect } from "element-plus";
import "element-plus/es/components/select/style/css";
import { computed, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import { type ManufactureItemType } from "..";
import { useDataStore } from "../../../stores/data";
import { formatNumber } from "../../../utils/math";

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

const localSource = computed({
  get: () => props.data.source,
  set: (val) => {
    // skip same value
    if (val === props.data.source) return;
    emits("source", props.data.type, val);
  },
});
const sourceOptions = computed(() => {
  if (!props.data.type) {
    return [
      { value: "manufacture", label: t("manufacture.item.source.manufacture") },
      { value: "purchase", label: t("manufacture.item.source.purchase") },
      { value: "original", label: t("manufacture.item.source.original") },
    ];
  }

  const canManufacture = props.data.blueprintId || props.data.isPlanetSchematic;
  if (canManufacture) {
    return [
      { value: "manufacture", label: t("manufacture.item.source.manufacture") },
      { value: "purchase", label: t("manufacture.item.source.purchase") },
    ];
  } else {
    return [
      { value: "purchase", label: t("manufacture.item.source.purchase") },
      { value: "original", label: t("manufacture.item.source.original") },
    ];
  }
});

const value = computed(() => {
  return formatNumber(props.data.quantity * props.data.price);
});

const recusionClass = computed(() => {
  return [`recursion-${props.data.recursion % 3}`];
});
</script>

<style lang="less" scoped>
.manufacture-item {
  box-sizing: border-box;

  padding: 10px;
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
