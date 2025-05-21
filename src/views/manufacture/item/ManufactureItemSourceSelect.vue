<template>
  <el-select v-model="localValue">
    <el-option v-for="o of options" :key="o.value" :label="o.label" :value="o.value" />
  </el-select>
</template>


<script lang="ts" setup>
import { ElOption, ElSelect } from "element-plus";
import "element-plus/es/components/select/style/css";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  canManufacture: {
    type: Boolean,
    default: true,
  },
  isOriginal: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["update:modelValue"]);

const { t } = useI18n();

const options = computed(() => {
  if (props.canManufacture && !props.isOriginal) {
    return [
      { value: "manufacture", label: t("manufacture.item.source.manufacture") },
      { value: "purchase", label: t("manufacture.item.source.purchase") },
    ];
  } else if (props.isOriginal && !props.canManufacture) {
    return [
      { value: "purchase", label: t("manufacture.item.source.purchase") },
      { value: "original", label: t("manufacture.item.source.original") },
    ];
  } else {
    return [{ value: "purchase", label: t("manufacture.item.source.purchase") }];
  }
});

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits("update:modelValue", value);
  },
});
</script>
