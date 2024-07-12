import { type RouteRaw } from ".";

export const mainRoute: RouteRaw[] = [
  {
    name: "index",
    path: "/",
    redirect: "/home",
  },
  {
    name: "home",
    path: "/home",
    component: async () => await import("../views/home/HomeView.vue"),
    meta: {
      title: "Home",
    },
  },
  {
    name: "market",
    path: "/market",
    component: async () => await import("../views/market/MarketView.vue"),
    meta: {
      title: "Market",
    },
  },
  {
    name: "config",
    path: "/config",
    component: async () => await import("../views/config/ConfigView.vue"),
    meta: {
      title: "Config",
    },
  },
];
