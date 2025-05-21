<template>
  <!--  -->
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import type { ManufactureItem } from ".";

const props = defineProps({
  data: {
    type: Object as PropType<ManufactureItem>,
    required: true,
  },
});
const emits = defineEmits(["change"]);
</script>
