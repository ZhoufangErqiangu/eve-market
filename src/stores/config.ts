import { defineStore } from "pinia";
import { ref } from "vue";
import DataSourceJson from "../assets/json/datasource.json";
import RouterJson from "../assets/json/router.json";

const CONFIG_KEY = "config";
const DEFAULT_CONFIG = {
  dataSource: DataSourceJson[0]?.value,
  router: RouterJson[0]?.value,
};

export const useConfigStore = defineStore("config", () => {
  // get config from localStorage
  const s = localStorage.getItem(CONFIG_KEY);
  const c: Record<string, string | undefined> = s
    ? JSON.parse(s)
    : DEFAULT_CONFIG;

  const dataSource = ref<string | undefined>(c.dataSource);
  const router = ref<string | undefined>(c.router);

  /**
   * set config
   */
  function setConfig(config: { dataSource?: string; router?: string }) {
    dataSource.value = config.dataSource;
    router.value = config.router;
    // save to localStorage
    localStorage.setItem(
      CONFIG_KEY,
      JSON.stringify({
        dataSource: config.dataSource,
        router: config.router,
      }),
    );
  }

  return {
    dataSource,
    router,

    setConfig,
  };
});
