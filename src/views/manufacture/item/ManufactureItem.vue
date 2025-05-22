<template>
  <div class="manufacture-item">
    <div class="item">
      <div class="type">
        {{ name }}
      </div>
      <div class="quantity">
        {{ props.data.quantity }}
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
    <div v-if="Boolean(props.data.materials)" class="materials">
      <div class="title">
        {{ $t("manufacture.item.materials") }}
      </div>
      <div class="list">
        <ManufactureItem v-for="i of props.data.materials" :key="i.type" :data="i" />
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
  return dataStroe.readTypeName(props.data.type.toString());
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
  } else if (props.data.blueprintId) {
    return [
      { value: "manufacture", label: t("manufacture.item.source.manufacture") },
      { value: "purchase", label: t("manufacture.item.source.purchase") },
    ];
  } else if (!props.data.blueprintId) {
    return [
      { value: "purchase", label: t("manufacture.item.source.purchase") },
      { value: "original", label: t("manufacture.item.source.original") },
    ];
  } else {
    return [];
  }
});

const value = computed(() => {
  return props.data.quantity * props.data.price;
});
</script>

<style lang="less" scoped>
.manufacture-item {
  border: solid 1px var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  padding: 10px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  .item {
    width: 260px;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 5px;
  }

  .isk {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .materials {
    width: fit-content;

    .list {
      margin-top: 5px;

      display: flex;
      align-items: start;
      gap: 10px;
    }
  }
}
</style>
