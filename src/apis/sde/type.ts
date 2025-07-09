export interface SdeType {
  id: string;
  name?: string;
  marketGroupID?: number;
  portionSize?: number;
}

export async function getSdeTypes(): Promise<Record<string, SdeType>> {
  const res = await fetch("/json/sde-types.json");
  if (!res.ok) throw new Error("Failed to fetch types");
  const bs: Record<string, SdeType> = await res.json();
  return bs;
}

export interface SdeTypeMaterial {
  id: string;
  materials: Array<{ id: number; quantity: number }>;
}

export async function getSdeTypeMaterials(): Promise<
  Record<string, SdeTypeMaterial>
> {
  const res = await fetch("/json/sde-typematerials.json");
  if (!res.ok) throw new Error("Failed to fetch type materials");
  const bs: Record<string, SdeTypeMaterial> = await res.json();
  return bs;
}
