import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from "vue-router";
import MainLayout from "../layouts/main/MainLayout.vue";
import NotFountView from "../views/system/NotFound.vue";
import { mainRoute } from "./main";
import { useLayoutStore } from "../stores/layout";

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
    path: "/",
    component: MainLayout,
    children: mainRoute,
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

const base = "/";
const title = import.meta.env.VITE_APP_TITLE ?? "";
export const router = createRouter({
  history: createWebHistory(base),
  routes,
});

export type RouteNormalized = RouteLocationNormalized & RouteMeta;

router.beforeEach((to, from) => {
  // 避免无限重定向
  if (to.fullPath === from.fullPath) return false;
});

router.afterEach((to) => {
  // debug
  if (import.meta.env.DEV) console.log("router to", to);
  const layoutStore = useLayoutStore();
  // set browser title
  const subTitle = (to as RouteNormalized).meta?.title;
  if (!subTitle) {
    window.document.title = title;
    layoutStore.setPage({ title, desc: "" });
  } else {
    window.document.title = `${title} | ${subTitle}`;
    layoutStore.setPage({ title: subTitle, desc: "" });
  }
});

export default router;
