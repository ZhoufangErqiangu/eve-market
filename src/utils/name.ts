import { postUniverseNames } from "../apis/esi/universe";

const NAME_CACHE = new Map<number, string>();

export async function getNames(ids: number[]) {
  const missingIds = ids.filter((id) => !NAME_CACHE.has(id));
  if (missingIds.length) {
    const { data: names } = await postUniverseNames(missingIds);
    names.forEach(({ id, name }) => NAME_CACHE.set(id, name));
  }
  return ids.map((id) => NAME_CACHE.get(id));
}
