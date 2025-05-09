import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useLayoutStore = defineStore("layout", () => {
  const headerTitle = ref(import.meta.env.VITE_APP_TITLE);
  const headerDesc = ref<string>();
  const messageCount = ref(0);
  const isDark = ref(
    (localStorage.getItem("layoutIsDark") ?? "true") === "true",
  );
  const menuCollapse = ref(false);

  function setHeader(title: string, desc?: string) {
    headerTitle.value = title;
    headerDesc.value = desc;
  }

  function toggleMenuCollapse() {
    menuCollapse.value = !menuCollapse.value;
  }

  watch(
    isDark,
    (val) => {
      localStorage.setItem("layoutIsDark", JSON.stringify(val));
      const html = document.documentElement;
      if (val) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    },
    { immediate: true },
  );

  /**
   * is column
   *
   * display column layout on mobile device
   */
  const isColumn = ref((window.visualViewport ?? window.screen).width < 768);

  return {
    headerTitle,
    headerDesc,
    setHeader,
    isDark,
    messageCount,
    isColumn,
    menuCollapse,
    toggleMenuCollapse,
  };
});
