import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from "vue-router";
import { useLayoutStore } from "../stores/layout";
import NotFountView from "../views/system/NotFound.vue";

export interface RouteMeta {
  meta?: {
    title: string;
    desc?: string;
    auth?: boolean | string;
  };
}

export type RouteRaw = RouteRecordRaw & RouteMeta;

const routes: RouteRaw[] = [
  {
    name: "index",
    path: "/",
    component: async () => await import("../views/home/HomeView.vue"),
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
    name: "missile",
    path: "/missile",
    component: async () => await import("../views/missile/MissileView.vue"),
    meta: {
      title: "Missile",
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
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFountView,
    meta: {
      title: "Not Found",
    },
  },
];

const title = import.meta.env.VITE_APP_TITLE ?? "";
export const router = createRouter({
  history: createWebHistory(),
  routes,
});

export type RouteNormalized = RouteLocationNormalized & RouteMeta;

router.afterEach((to) => {
  // debug
  if (import.meta.env.DEV) console.log("router to", to);

  const layoutStore = useLayoutStore();
  // set title
  const subTitle = (to as RouteNormalized).meta?.title;
  const t = subTitle ? `${title} | ${subTitle}` : title;
  window.document.title = t;
  layoutStore.setHeader(t);
});

export default router;
