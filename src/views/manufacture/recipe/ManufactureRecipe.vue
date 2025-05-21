<template>
  <div class="manufacture-store">
    <el-select v-model="localValue" class="recipes" :filterable="true" :allow-create="true">
      <el-option v-for="o of options" :key="o.value" :label="o.label" :value="o.value" />
    </el-select>
    <el-button type="primary" :disabled="!props.modelValue" @click="onSave">
      {{ $t("manufacture.save") }}
    </el-button>
    <el-button :disabled="!props.modelValue" @click="onCancel">
      {{ $t("manufacture.cancel") }}
    </el-button>
    <el-button type="danger" :disabled="!props.modelValue" @click="onDelete">
      {{ $t("manufacture.delete") }}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { ElButton, ElSelect, ElOption } from "element-plus";
import "element-plus/es/components/button/style/css";
import { computed, type PropType } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
  options: {
    type: Array as PropType<Array<{ label: string; value: string }>>,
    default: () => [],
  },
});
const emits = defineEmits(["update:modelValue", "save", "cancel", "delete"]);

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits("update:modelValue", value);
  },
});

function onSave() {
  emits("save");
}
function onCancel() {
  emits("cancel");
}
function onDelete() {
  emits("delete");
}
</script>

<style lang="less" scoped>
.manufacture-store {
  .recipes {
    width: 200px;
    margin-right: 12px;
  }
}
</style>
