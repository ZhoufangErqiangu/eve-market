import { defineStore } from "pinia";
import { computed, ref } from "vue";
import ESISwaggerJson from "../assets/esi/swagger.json";

export interface Config {
  esiDataSource: string;
  marketRegion: number;
}

const CONFIG_KEY = "config";
const DEFAULT_CONFIG: Config = {
  esiDataSource: "tranquility",
  marketRegion: 10000002,
};

export const useConfigStore = defineStore("config", () => {
  // read config from localStorage
  const s = localStorage.getItem(CONFIG_KEY);
  const c: Config = s ? JSON.parse(s) : DEFAULT_CONFIG;

  const _esiDataSource = ref<string | undefined>(c.esiDataSource);
  const esiDataSource = computed({
    get: () => _esiDataSource.value,
    set: (v) => {
      _esiDataSource.value = v;
      save();
    },
  });
  /**
   * do not modify the options
   */
  const esiDataSourceOptions = ESISwaggerJson.parameters.datasource.enum.map(
    (ds) => {
      return {
        label: `config.esi.datasource.${ds}`,
        value: ds,
      };
    },
  );

  const _marketRegion = ref<number>(
    c.marketRegion ?? DEFAULT_CONFIG.marketRegion,
  );
  const marketRegion = computed({
    get: () => _marketRegion.value,
    set: (v) => {
      _marketRegion.value = v ?? DEFAULT_CONFIG.marketRegion;
      save();
    },
  });

  function save() {
    localStorage.setItem(
      CONFIG_KEY,
      JSON.stringify({
        esiDataSource: esiDataSource.value,
        marketRegion: _marketRegion.value,
      }),
    );
  }

  return {
    esiDataSource,
    esiDataSourceOptions,
    marketRegion,
    save,
  };
});
