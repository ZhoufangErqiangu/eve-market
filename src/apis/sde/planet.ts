export interface SdePlanetSchematicType {
  isInput: boolean;
  quantity: number;
}

export interface SdePlanetSchematic {
  cycleTime: number;
  types: Record<string, SdePlanetSchematicType>;
}

export async function getSdePlanetSchematics(): Promise<
  Array<SdePlanetSchematic>
> {
  const res = await fetch("/json/sde-planetschematics.json");
  if (!res.ok) throw new Error("Failed to fetch schematics");
  const bs: Record<string, SdePlanetSchematic> = await res.json();
  return Object.values(bs);
}
