<template>
  <div class="manufacture-path">
    <div class="item">
      <el-icon class="icon" color="white" :size="15">
        <component :is="icon" />
      </el-icon>
      <div class="type">
        <div class="name">
          {{ name }}
        </div>
        <div class="quantitiy">
          {{ quanity }}
        </div>
      </div>
      <el-divider direction="vertical" />
      <div class="isk">
        <div class="label">
          {{ $t("manufacture.item.value") }}
        </div>
        <div class="value">
          {{ value }}
        </div>
      </div>
      <el-divider direction="vertical" />
      <ItemSource class="source" :data="props.data" @source="onSource" />
    </div>
    <div v-if="showMaterials" class="materials">
      <ManufacturePath v-for="m of props.data.materials" :key="m.type" :data="m" @source="onSource" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight, ArrowDown } from "@element-plus/icons-vue";
import { ElDivider, ElIcon } from "element-plus";
import "element-plus/es/components/divider/style/css";
import "element-plus/es/components/icon/style/css";
import { computed, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import { type ManufactureItemType } from "..";
import { useDataStore } from "../../../stores/data";
import { formatNumber } from "../../../utils/math";
import ItemSource from "../ManufactureSource.vue";

const props = defineProps({
  data: {
    type: Object as PropType<ManufactureItemType>,
    required: true,
  },
});
const emits = defineEmits(["source"]);

const { t } = useI18n();
const dataStroe = useDataStore();

const name = computed(() => {
  if (!props.data.type) return t("Unknown");
  return dataStroe.types[props.data.type.toString()] || t("Unknown");
});
const quanity = computed(() => {
  return Math.ceil(props.data.quantity).toLocaleString("en-US");
});

const value = computed(() => {
  return formatNumber(props.data.quantity * props.data.price);
});

const showMaterials = computed(() => {
  return props.data.source === "manufacture" && Boolean(props.data.materials);
});
const icon = computed(() => {
  return showMaterials.value ? ArrowDown : ArrowRight;
});

function onSource(type: string, source: string) {
  emits("source", type, source);
}
</script>

<style lang="less" scoped>
.manufacture-path {
  .item {
    display: flex;
    align-items: center;
  }

  .icon {
    margin-right: 5px;
  }

  .type {
    width: 160px;
    display: flex;
    justify-content: space-between;
  }

  .isk {
    width: 150px;
    display: flex;
    justify-content: space-between;
  }

  .materials {
    margin-top: 5px;
    padding-left: 20px;
  }
}

.manufacture-path+.manufacture-path {
  margin-top: 5px;
}
</style>
