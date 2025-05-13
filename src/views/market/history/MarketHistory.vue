<template>
  <div class="market-history">
    <div ref="chartRef" class="chart" />
  </div>
</template>

<script lang="ts" setup>
import { init, type ECharts } from "echarts";
import { BarChart, ScatterChart } from "echarts/charts";
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { ElMessage } from "element-plus";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useConfigStore } from "../../../stores/config";
import { useDataStore } from "../../../stores/data";
import { useLayoutStore } from "../../../stores/layout";

const props = defineProps({
  type: {
    type: Number,
    required: true,
  },
});

const configStore = useConfigStore();
const dataStore = useDataStore();
const layoutStore = useLayoutStore();
const chartRef = ref<HTMLDivElement>();

const chart = ref<ECharts>();
function resizeHandler() {
  chart.value?.resize();
}

use([
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  CanvasRenderer,
  BarChart,
  ScatterChart,
]);

async function buildChart() {
  if (!chartRef.value) {
    console.warn("null chart");
    return;
  }

  if (!chart.value) {
    chart.value = init(chartRef.value, layoutStore.isDark ? "dark" : undefined);
  }

  try {
    const hs = await dataStore.readMarketHistory(configStore.marketRegion, props.type);
    chart.value.setOption({
      grid: [
        {
          left: 10,
          right: 10,
          height: "75%",
        },
        {
          left: 10,
          right: 10,
          top: "80%",
          height: "20%",
        },
      ],
      xAxis: [
        {
          type: "time",
          show: false,
        },
        {
          gridIndex: 1,
          type: "time",
        },
      ],
      yAxis: [
        {
          type: "value",
          max: hs.reduce((max, h) => Math.max(max, h.high), 0),
        },
        {
          gridIndex: 1,
          type: "value",
          max: hs.reduce((max, h) => Math.max(max, h.volume), 0),
        },
      ],
      serials: [
        {
          type: "scatter",
          data: hs.map(h => [h.date, h.high]),
        },
        {
          type: "scatter",
          data: hs.map(h => [h.date, h.low]),
        },
        {
          type: "bar",
          data: hs.map(h => [h.date, h.volume]),
          yAxisIndex: 1,
        },
      ],
    });
  } catch (err) {
    console.error("build chart error", err);
    ElMessage.error("Build chart error");
  }
}

watch(
  () => props.type,
  () => {
    void buildChart();
  },
);
watch(
  () => configStore.marketRegion,
  () => {
    void buildChart();
  },
);

const os = new IntersectionObserver((e) => {
  if (!e[0]?.isIntersecting) return;
  buildChart();
});

onMounted(() => {
  window.addEventListener("resize", resizeHandler);
  os.observe(chartRef.value!);
});
onUnmounted(() => {
  window.removeEventListener("resize", resizeHandler);
  chart.value?.dispose();
  os.disconnect();
});
</script>

<style lang="less" scoped>
.market-history {
  height: 100%;

  .chart {
    height: 100%;
  }
}
</style>
