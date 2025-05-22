export interface SdeMarketGroup {
  id: string;
  name: string;
  hasTypes: boolean;
  parentGroupID?: number;
}

export async function getSdeMarketGroups(): Promise<Array<SdeMarketGroup>> {
  const res = await fetch("/json/sde-marketgroups.json");
  if (!res.ok) throw new Error("Failed to fetch market groups");
  const bs: Record<string, SdeMarketGroup> = await res.json();
  return Object.values(bs);
}
