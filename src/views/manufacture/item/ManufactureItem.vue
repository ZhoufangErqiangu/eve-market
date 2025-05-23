<template>
  <div class="manufacture-item" :class="recusionClass">
    <el-space class="item">
      <div class="type">
        <div class="name">
          {{ name }}
        </div>
        <div class="quantity">
          {{ props.data.quantity }}
        </div>
      </div>
      <el-divider direction="vertical" />
      <div class="isk">
        <div class="text1">
          {{ $t("manufacture.item.value") }}
        </div>
        <div class="text2">
          {{ value }}
        </div>
      </div>
      <el-divider direction="vertical" />
      <div class="isk">
        <div class="text1">
          {{ $t("manufacture.item.cost") }}
        </div>
        <div class="text2">
          {{ cost }}
        </div>
      </div>
      <el-divider direction="vertical" />
      <el-select v-model="localSource" class="source">
        <el-option v-for="o of sourceOptions" :key="o.value" :label="o.label" :value="o.value" />
      </el-select>
    </el-space>
    <div v-if="showMaterials" class="materials">
      <ManufactureItem v-for="m of localMaterials" :key="m.data.type" :data="m.data" @change="m.onChange" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElDivider, ElOption, ElSelect, ElSpace } from "element-plus";
import "element-plus/es/components/divider/style/css";
import "element-plus/es/components/select/style/css";
import "element-plus/es/components/space/style/css";
import { computed, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import { calculateItemCost, type ManufactureItemType } from "..";
import { useDataStore } from "../../../stores/data";
import { formatNumber } from "../../../utils/math";

const props = defineProps({
  data: {
    type: Object as PropType<ManufactureItemType>,
    required: true,
  },
});
const emits = defineEmits(["change"]);

const { t } = useI18n();
const dataStroe = useDataStore();

const name = computed(() => {
  if (!props.data.type) return t("Unknown");
  return dataStroe.types[props.data.type.toString()] || t("Unknown");
});

const localSource = computed({
  get: () => props.data.source,
  set: (val) => {
    // skip same value
    if (val === props.data.source) return;
    emits("change", { ...props.data, source: val });
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

const showMaterials = computed(() => {
  if (props.data.source !== "manufacture") return false;
  return Boolean(props.data.materials);
});
const localMaterials = computed(() => {
  if (!props.data.materials) return undefined;

  return props.data.materials.map((m, i) => {
    return {
      data: m,
      onChange: (item: ManufactureItemType) => {
        const nl = [...props.data.materials!];
        nl[i] = item;
        emits("change", {
          ...props.data,
          materials: nl,
        });
      },
    };
  });
});

const value = computed(() => {
  return formatNumber(props.data.quantity * props.data.price);
});
const cost = computed(() => {
  return formatNumber(calculateItemCost(props.data));
});

const recusionClass = computed(() => {
  return [`recursion-${props.data.recursion % 3}`];
});
</script>

<style lang="less" scoped>
.manufacture-item {
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
    width: 220px;

    display: flex;
    justify-content: space-between;
  }

  .source {
    width: 150px;
  }

  .isk {
    width: 200px;

    display: flex;
    justify-content: space-between;
  }

  .materials {
    margin-top: 5px;
  }
}

.manufacture-item+.manufacture-item {
  margin-top: 10px;
}
</style>
