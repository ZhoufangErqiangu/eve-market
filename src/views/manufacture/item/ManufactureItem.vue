<template>
  <div class="manufacture-item">
    <div class="item">
      <div class="header">
        <div class="type">
          {{ name }}
        </div>
        <div class="quantity">
          {{ props.data.quantity }}
        </div>
      </div>
      <el-select v-model="localSource">
        <el-option v-for="o of sourceOptions" :key="o.value" :label="o.label" :value="o.value" />
      </el-select>
      <div class="isk">
        <div class="text1">
          {{ $t("manufacture.item.value") }}
        </div>
        <div class="text2">
          {{ value }}
        </div>
      </div>
    </div>
    <div v-if="showMaterials" class="materials">
      <div class="title">
        {{ $t("manufacture.item.materials") }}
      </div>
      <div class="list">
        <ManufactureItem v-for="m of localMaterials" :key="m.data.type" :data="m.data" @change="m.onChange" />
      </div>
    </div>
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

    if (val === "manufacture") {
      emits("change", {
        ...props.data,
        source: val,
      });
    }
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
</script>

<style lang="less" scoped>
.manufacture-item {
  border: solid 1px var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  padding: 10px;

  .item {
    width: 220px;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 5px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .isk {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .materials {
    margin-top: 5px;

    .list {
      margin-top: 5px;

      display: flex;
      align-items: start;
      flex-wrap: wrap;
      gap: 10px;
    }
  }
}
</style>
