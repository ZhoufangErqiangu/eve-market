import { type UniverseType, getUniverseTypeById } from "../apis/esi/universe";

const TYPE_CACHE = new Map<number, UniverseType>();

export async function getType(id: number) {
  if (TYPE_CACHE.has(id)) return TYPE_CACHE.get(id);
  const { data: tt } = await getUniverseTypeById(id);
  if (!tt) return undefined;
  TYPE_CACHE.set(id, tt);
  return tt;
}
