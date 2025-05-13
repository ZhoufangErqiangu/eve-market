<template>
  <div class="market-order-table">
    <div class="market-order-table-header">
      <h3>
        {{ props.header }}
      </h3>
    </div>
    <div class="market-order-table-body">
      <el-table :data="data" height="100%" :default-sort="props.sort">
        <el-table-column :label="$t('market.order.table.quanity')" prop="remainQuantity" :sortable="true" />
        <el-table-column :label="$t('market.order.table.price')" prop="price" :sortable="true">
          <template #default="{ row }">
            {{ priceFormatter(row) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('market.order.table.duration')" prop="duration" :sortable="true" />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import { ElTable, ElTableColumn, type Sort } from "element-plus";
import "element-plus/es/components/table-column/style/css";
import "element-plus/es/components/table/style/css";
import { computed, type PropType } from "vue";
import { type MarketOrder } from "../../../stores/data";

const props = defineProps({
  header: {
    type: String,
    required: true,
  },
  orders: {
    type: Array as PropType<MarketOrder[]>,
    required: true,
  },
  sort: {
    type: Object as PropType<Sort>,
    default: () => ({ prop: "price", order: "descending" }),
  },
});

function priceFormatter(row: MarketOrder) {
  return `${row.price.toLocaleString()} ISK`;
}

const now = dayjs();
const data = computed(() => {
  return props.orders.map((o) => {
    const p = dayjs(o.createdAt).diff(now, "day");
    return {
      ...o,
      duration: o.duration + p,
    };
  });
});
</script>

<style lang="less" scoped>
.market-order-table {
  height: 50%;
  display: flex;
  flex-direction: column;
}

.market-order-table-header {
  display: flex;
  align-items: center;
  height: 40px;
}

.market-order-table-body {
  flex: 1;
  overflow: hidden;
}
</style>
