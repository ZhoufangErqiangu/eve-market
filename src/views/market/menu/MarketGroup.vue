<template>
  <div class="market-group" @click="onCollapse">
    <div class="header">
      <el-icon class="icon" :class="{ 'is-collapse': isCollapsed }" :size="16">
        <ArrowDownBold />
      </el-icon>
      <div class="text1">
        {{ props.data.name }}
      </div>
    </div>
    <div v-if="!isCollapsed" class="body">
      <div v-if="data.children" class="children">
        <MarketGroup v-for="mg in data.children" :key="mg.id" :data="mg" @group="onChildGroup" @type="onChildType" />
      </div>
      <MarketTypes :data="props.data.types" @type="onType" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDownBold } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";
import "element-plus/es/components/icon/style/css";
import { ref, type PropType } from "vue";
import { type MarketGroup as MarketGroupType } from "../../../stores/data";
import MarketTypes from "./MarketTypes.vue";

const props = defineProps({
  data: {
    type: Object as PropType<MarketGroupType>,
    required: true,
  },
});
const emits = defineEmits(["group", "type"]);

const isCollapsed = ref(true);
function onCollapse(ev: MouseEvent) {
  ev.stopPropagation();
  isCollapsed.value = !isCollapsed.value;
  if (!isCollapsed.value) emits("group", props.data.id);
}
function onType(id: number) {
  emits("type", id, props.data.id);
}

function onChildGroup(id: number) {
  emits("group", id);
}
function onChildType(id: number, group: number) {
  emits("type", id, group);
}
</script>

<style lang="less" scoped>
.market-group {
  height: auto;

  .header {
    padding: 10px;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    cursor: pointer;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  .body {
    padding-left: 10px;
  }

  .icon {
    margin-right: 5px;
    transition: transform 0.3s;

    &.is-collapse {
      transform: rotate(-90deg);
    }
  }
}
</style>
