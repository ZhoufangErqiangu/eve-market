import { service } from ".";

export interface UniverseType {
  capacity?: number;
  description: string;
  dogma_attributes?: Array<{ attribute_id: number; value: number }>;
  dogma_effects?: Array<{ effect_id: number; is_default: boolean }>;
  graphic_id?: number;
  group_id: number;
  icon_id?: number;
  market_group_id?: number;
  mass?: number;
  name: string;
  packaged_volume?: number;
  portion_size?: number;
  published: boolean;
  radius?: number;
  type_id: number;
  volume?: number;
}

export async function getUniverseTypeById(id: number, language?: string) {
  return await service.request<UniverseType>({
    url: `/universe/types/${id}`,
    method: "get",
    params: {
      language,
    },
  });
}

export interface UniverseName {
  category: string;
  id: number;
  name: string;
}
/**
 * Resolve a set of IDs to names and categories. Supported ID’s for resolving are: Characters, Corporations, Alliances, Stations, Solar Systems, Constellations, Regions, Types, Factions
 *
 * https://ali-esi.evepc.163.com/ui/#/Universe/post_universe_names
 */
export async function postUniverseNames(ids: number[]) {
  return await service.request<UniverseName[]>({
    url: "/universe/names",
    method: "post",
    data: ids,
  });
}
