<template>
  <div class="market-group-item-type" @click="onClick">
    <div class="market-group-item-text">
      {{ typeName }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getType } from "../../utils/type";

const props = defineProps({
  typeId: {
    type: Number,
    required: true
  },
});
const emits = defineEmits(["type"]);

const typeName = ref(props.typeId.toString());
async function init() {
  const t = await getType(props.typeId);
  if (t) {
    typeName.value = t.name;
  }
}
onMounted(init);

function onClick(ev: MouseEvent) {
  ev.stopPropagation();
  emits("type", props.typeId);
}
</script>

<style lang="less" scoped>
.market-group-item-type {
  padding: 10px;
  cursor: pointer;

  &:hover {
    color: var(--el-color-primary);
  }
}
</style>
