<template>
  <el-container class="h100">
    <el-header class="pl0 pr0" style="height: auto;">
      <div class="manufacture-header">
        <h2>
          {{ $t("manufacture.title") }}
        </h2>
        <ManufactureRecipeComponent v-model="recipe" :options="recipeOptions" @save="onSave" @cancel="onCancel"
          @delete="onDelete" />
      </div>
    </el-header>
    <el-main class="pl0 pb0 pr0">
      <ManufactureProducts v-model="products" />
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ElContainer, ElHeader, ElMain, ElMessage } from "element-plus";
import "element-plus/es/components/container/style/css";
import { ref, watch } from "vue";
import { type ManufactureProductType } from ".";
import ManufactureProducts from "./product/ManufactureProducts.vue";
import { loadManufactureLastRecipeKey, loadManufactureRecipe, loadManufactureRecipes, removeManufactureRecipe, saveManufactureRecipe } from "./recipe";
import ManufactureRecipeComponent from "./recipe/ManufactureRecipe.vue";

const recipe = ref<string | undefined>(loadManufactureLastRecipeKey());
const recipeOptions = ref<Array<{ label: string, value: string }>>(loadManufactureRecipes());

const products = ref<Array<ManufactureProductType>>([{
  quantity: 1,
}]);

function onLoad(key: string) {
  const r = loadManufactureRecipe(key);
  if (!r) return;
  // todo
}
function onSave() {
  if (!recipe.value) {
    ElMessage.warning("Must input recipe name");
    return;
  }

  saveManufactureRecipe({ name: recipe.value });
  recipeOptions.value = loadManufactureRecipes();
}
function onCancel() {
  if (!recipe.value) return;
  onLoad(recipe.value);
}
function onDelete() {
  products.value = [{ quantity: 1 }];

  if (!recipe.value) return;
  removeManufactureRecipe(recipe.value);
  recipeOptions.value = loadManufactureRecipes();
  recipe.value = undefined;
}

watch(recipe, (val, oldVal) => {
  if (!val) return;
  else if (val === oldVal) return;
  onLoad(val);
}, { immediate: true });
</script>

<style lang="less" scoped>
.manufacture-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 24px;
  }
}
</style>
