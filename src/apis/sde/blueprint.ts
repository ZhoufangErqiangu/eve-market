export interface SdeBlueprintActivity {
  materials?: Array<{ quantity: number; typeID: number }>;
  products?: Array<{ quantity: number; typeID: number }>;
  time: number;
}

export interface SdeBlueprint {
  id: string;
  blueprintTypeID: number;
  activities: {
    manufacturing?: SdeBlueprintActivity;
    reaction?: SdeBlueprintActivity;
  };
}

export async function getSdeBlueprints(): Promise<Array<SdeBlueprint>> {
  const res = await fetch("/json/sde-blueprints.json");
  if (!res.ok) throw new Error("Failed to fetch blueprints");
  const bs: Record<string, SdeBlueprint> = await res.json();
  return Object.values(bs);
}
