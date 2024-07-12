<template>
  <div class="market-order-table">
    <div class="market-order-table-header">
      <h3>
        {{ $t(props.header) }}
      </h3>
    </div>
    <div class="market-order-table-body">
      <el-table :data="props.orders" height="100%" :default-sort="props.sort">
        <el-table-column :label="$t('Volume')" prop="volume_remain" :sortable="true" />
        <el-table-column :label="$t('Price')" prop="price" :sortable="true">
          <template #default="{ row }">
            {{ priceFormatter(row) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Duration')" prop="duration" :sortable="true" />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElTable, ElTableColumn, type Sort } from "element-plus";
import "element-plus/es/components/table-column/style/css";
import "element-plus/es/components/table/style/css";
import { type PropType } from "vue";
import { type MarketOrder } from "../../apis/esi/market";

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
  }
});
function priceFormatter(row: MarketOrder) {
  return `${row.price.toLocaleString()} ISK`;
}
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
