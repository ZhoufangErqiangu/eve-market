<template>
  <div class="manufacture-layer">
    <div class="delete-box">
      <el-button type="danger" size="small" @click="onDelete">
        {{ $t("manufacture.delete") }}
      </el-button>
    </div>
    <div class="items-container">
      <ManufactureItemComponent v-for="i of props.data.items" :key="i.type" :data="i" @change="onItemChange" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElButton } from "element-plus";
import "element-plus/es/components/button/style/css";
import { type PropType } from "vue";
import { type ManufactureItemType, type ManufactureLayerType } from ".";
import ManufactureItemComponent from "./ManufactureItem.vue";

const props = defineProps({
  data: {
    type: Object as PropType<ManufactureLayerType>,
    required: true,
  },
  allowDelete: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(["change", "delete"]);

function onItemChange(item: ManufactureItemType) {
  const idx = props.data.items.findIndex((i) => i.type === item.type);
  if (idx === -1) return;
  const ll = Array.from(props.data.items);
  ll[idx] = item;
  emits("change", { id: props.data.id, items: ll });
}

function onDelete() {
  if (!props.allowDelete) return;
  emits("delete", props.data.id);
}
</script>

<style lang="less" scoped>
.manufacture-layer {
  .delete-box {
    text-align: right;
  }

  .items-container {
    overflow-x: auto;
  }

  .items {
    width: fit-content;
    display: flex;
  }
}
</style>
