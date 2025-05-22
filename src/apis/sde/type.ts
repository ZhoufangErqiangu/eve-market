export interface SdeType {
  id: string;
  name?: string;
  marketGroupID?: number;
}

export async function getSdeTypes(): Promise<Array<SdeType>> {
  const res = await fetch("/json/sde-types.json");
  if (!res.ok) throw new Error("Failed to fetch types");
  const bs: Record<string, SdeType> = await res.json();
  return Object.values(bs);
}
