<template>
  <div class="market-item-price">
    <div class="market-item-price-title">
      {{ $t(props.title) }}
    </div>
    <div class="market-item-price-num">
      {{ priceStr }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0.0,
  },
});

const priceStr = computed(() => {
  return `${props.price.toLocaleString()} ISK`;
});
</script>

<style lang="less" scoped>
.market-item-price-num {
  font-size: 20px;
  font-weight: bold;
}
</style>
