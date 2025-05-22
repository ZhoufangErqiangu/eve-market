import { type ManufactureProductType } from "..";

const MANUFACTURE_RECIPES_KEY = "manufacture.recipes";
const MANUFACTURE_LAST_RECIPE_KEY = "manufacture.last_recipe";

export interface ManufactureRecipe {
  name: string;
  products: Array<ManufactureProductType>;
}

function buildManufactureRecipeKey(name: string): string {
  return `manufacture.recipe.${name}`;
}

/**
 * load manufacture recipes from local storage
 * @returns manufacture recipes options
 */
export function loadManufactureRecipes(): Array<{
  label: string;
  value: string;
}> {
  const rss = localStorage.getItem(MANUFACTURE_RECIPES_KEY);
  if (!rss) return [];
  const rs: string[] = JSON.parse(rss);
  return rs
    .map((r) => ({
      label: r,
      value: buildManufactureRecipeKey(r),
    }))
    .filter((r) => localStorage.getItem(r.value) !== null);
}

/**
 * load manufacture last recipe key from local storage
 * @returns manufacture last recipe key
 */
export function loadManufactureLastRecipeKey(): string | undefined {
  return localStorage.getItem(MANUFACTURE_LAST_RECIPE_KEY) ?? undefined;
}

/**
 * load manufacture recipe from local storage
 */
export function loadManufactureRecipe(key: string): ManufactureRecipe | null {
  const rs = localStorage.getItem(key);
  if (!rs) return null;

  // save last recipe key
  localStorage.setItem(MANUFACTURE_LAST_RECIPE_KEY, key);

  return JSON.parse(rs);
}

export function saveManufactureRecipe(recipe: ManufactureRecipe): void {
  const key = buildManufactureRecipeKey(recipe.name);

  // save data
  localStorage.setItem(key, JSON.stringify(recipe));

  // save last recipe key
  localStorage.setItem(MANUFACTURE_LAST_RECIPE_KEY, key);

  // save recipes
  const rs = JSON.parse(localStorage.getItem(MANUFACTURE_RECIPES_KEY) ?? "[]");
  rs.push(recipe.name);
  localStorage.setItem(MANUFACTURE_RECIPES_KEY, JSON.stringify(rs));
}

export function removeManufactureRecipe(key: string): void {
  // remove data
  localStorage.removeItem(key);

  // remove last recipe key
  localStorage.removeItem(MANUFACTURE_LAST_RECIPE_KEY);

  // remove recipes
  const rs: string[] = JSON.parse(
    localStorage.getItem(MANUFACTURE_RECIPES_KEY) ?? "[]",
  );
  const index = rs.findIndex((r) => buildManufactureRecipeKey(r) === key);
  if (index > -1) {
    rs.splice(index, 1);
    localStorage.setItem(MANUFACTURE_RECIPES_KEY, JSON.stringify(rs));
  }
}
