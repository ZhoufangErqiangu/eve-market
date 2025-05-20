import { defineStore } from "pinia";
import { computed, ref } from "vue";
import EsiDatasourceJson from "../assets/json/esi-datasource.json";
import EsiRegionJson from "../assets/json/esi-region.json";

export interface Config {
  esiDataSource?: string;
  marketRegion: number;
}

const CONFIG_KEY = "config";
const DEFAULT_CONFIG: Config = {
  esiDataSource: undefined,
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
  const esiDataSourceOptions = EsiDatasourceJson.map((ds) => {
    return {
      label: `config.esi.datasource.${ds}`,
      value: ds,
    };
  });

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
  const marketRegionOptions = EsiRegionJson.map((r) => {
    return {
      label: r.name,
      value: r.id,
    };
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
    marketRegionOptions,
    save,
  };
});
