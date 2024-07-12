import axios from "axios";
import { useConfigStore } from "../../stores/config";

// https://esi.evetech.net/ui/#/
export const service = axios.create({
  baseURL: import.meta.env.VITE_APP_ESI_API,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

service.interceptors.request.use((config) => {
  const configStore = useConfigStore();
  if (configStore.router && config.url) {
    config.url = `/${configStore.router}${config.url}`;
  }
  return config;
});
