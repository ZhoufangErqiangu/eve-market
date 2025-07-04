<template>
  <el-radio-group :model-value="props.modelValue" @update:model-value="(val) => emits('update:modelValue', val)">
    <el-radio-button :label="$t('abastraction.tab.sell')" :value="0" />
    <el-radio-button :label="$t('abastraction.tab.buy')" :value="1" />
  </el-radio-group>
</template>

<script lang="ts" setup>
import { ElRadioGroup, ElRadioButton } from "element-plus";
import "element-plus/es/components/radio-group/style/css";
import "element-plus/es/components/radio-button/style/css";

const props = defineProps({
  modelValue: {
    type: Number,
    default: undefined,
  },
});
const emits = defineEmits(["update:modelValue"]);
</script>
