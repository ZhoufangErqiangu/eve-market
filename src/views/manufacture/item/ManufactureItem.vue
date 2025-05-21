<template>
  <div class="manufacture-item">
    <SourceSelect v-model="localSource" :can-manufacture="props.data.canManufacture"
      :is-original="props.data.isOriginal" />
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { type ManufactureItemType } from "..";
import SourceSelect from "./ManufactureItemSourceSelect.vue";

const props = defineProps({
  data: {
    type: Object as PropType<ManufactureItemType>,
    required: true,
  }
});
const emits = defineEmits(["change"]);

const localSource = computed({
  get: () => props.data.source,
  set: (value) => {
    emits("change", { ...props.data, source: value });
  },
});
</script>

<style lang="less" scoped>
.manufacture-item {
  width: 220px;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 5px;
  border: solid 1px var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  padding: 10px;
}
</style>
