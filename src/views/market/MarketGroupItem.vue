<template>
  <div class="market-group-item-box" @click="onCollapse">
    <div class="market-group-item-header">
      <el-icon class="market-group-item-header-icon" :class="{ 'is-collapse': isCollapsed }" :size="16">
        <ArrowDownBold />
      </el-icon>
      <div class="market-group-item-text">
        {{ props.item.name }}
      </div>
    </div>
    <div v-if="!isCollapsed" class="market-group-item-body">
      <div v-if="item.children" class="market-group-item-children">
        <MarketGroupItem v-for="g in item.children" :key="g.market_group_id" :item="g" @group="onChildGroup"
          @type="onChildType" />
      </div>
      <div class="market-group-item-types">
        <MarketGroupItemType v-for="t in props.item.types" :key="t" :type-id="t" @type="onType" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDownBold } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";
import "element-plus/es/components/icon/style/css";
import { ref, type PropType } from "vue";
import { type MarketGroup2 } from "../../utils/market";
import MarketGroupItemType from "./MarketGroupItemType.vue";

const props = defineProps({
  item: {
    type: Object as PropType<MarketGroup2>,
    required: true,
  },
});
const emits = defineEmits(["group", "type"]);

const isCollapsed = ref(true);
function onCollapse(ev: MouseEvent) {
  ev.stopPropagation();
  isCollapsed.value = !isCollapsed.value;
  if (!isCollapsed.value) emits("group", props.item.market_group_id);
}
function onType(id: number) {
  emits("type", id, props.item.market_group_id);
}

function onChildGroup(id: number) {
  emits("group", id);
}
function onChildType(id: number, groupId: number) {
  emits("type", id, groupId);
}
</script>

<style lang="less" scoped>
.market-group-item-box {
  height: auto;
}

.market-group-item-header {
  padding: 10px;
  display: flex;
  // justify-content: space-between;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: var(--el-color-primary);
  }
}

.market-group-item-body {
  padding-left: 10px;
}

.market-group-item-type {
  padding: 10px;
  cursor: pointer;

  &:hover {
    color: var(--el-color-primary);
  }
}

.market-group-item-header-icon {
  margin-right: 5px;
  transition: transform 0.3s;

  &.is-collapse {
    transform: rotate(-90deg);
  }
}
</style>
