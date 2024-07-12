<template>
  <el-input-number v-model="localValue" :disabled="disabled" :placeholder="$t('Please input percent')"
    :precision="precision" />
</template>

<script lang="ts" setup>
import { ElInputNumber } from "element-plus";
import "element-plus/es/components/input-number/style/css";
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  precision: {
    type: Number,
    default: 2
  }
});
const emits = defineEmits(["update:modelValue"]);

const localValue = computed({
  get: () => props.modelValue ? props.modelValue * 100.0 : props.modelValue,
  set: (value) => {
    emits("update:modelValue", value ? value / 100.0 : value);
  },
});
</script>

<style lang="less" scoped></style>
