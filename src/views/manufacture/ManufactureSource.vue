<template>
  <el-radio-group v-model="localSource" class="manufacture-item-source" size="small">
    <el-radio-button v-for="o of sourceOptions" :key="o.value" :label="o.label" :value="o.value" />
  </el-radio-group>
</template>

<script lang="ts" setup>
import { ElRadioButton, ElRadioGroup } from "element-plus";
import "element-plus/es/components/radio-button/style/css";
import "element-plus/es/components/radio-group/style/css";
import { computed, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import type { ManufactureItemType } from ".";

const props = defineProps({
  data: {
    type: Object as PropType<ManufactureItemType>,
    required: true,
  },
});
const emits = defineEmits(["source"]);

const { t } = useI18n();

const sourceOptions = computed(() => {
  if (!props.data.type) {
    return [
      { value: "purchase", label: t("manufacture.item.source.purchase") },
      { value: "original", label: t("manufacture.item.source.original") },
      { value: "manufacture", label: t("manufacture.item.source.manufacture") },
    ];
  }

  const canManufacture = props.data.blueprintId || props.data.isPlanetSchematic;
  if (canManufacture) {
    return [
      { value: "purchase", label: t("manufacture.item.source.purchase") },
      { value: "manufacture", label: t("manufacture.item.source.manufacture") },
    ];
  } else {
    return [
      { value: "purchase", label: t("manufacture.item.source.purchase") },
      { value: "original", label: t("manufacture.item.source.original") },
    ];
  }
});

const localSource = computed({
  get: () => props.data.source,
  set: (val) => {
    // skip same value
    if (val === props.data.source) return;
    emits("source", props.data.type, val);
  },
});
</script>
