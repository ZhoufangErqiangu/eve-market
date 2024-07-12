import {
  getMarketGroup,
  getMarketGroupById,
  getMarketRegionOrder,
  type MarketGroup,
  type MarketOrder,
} from "../apis/esi/market";

export const MARKET_GROUP_KEY = "marketGroup";
let MARKET_CACHE: MarketGroup2[] | undefined;

export interface MarketGroup2 extends MarketGroup {
  children: MarketGroup2[];
}

export function getMarketGroupTree(
  marketGroups: MarketGroup[],
): MarketGroup2[] {
  function useChildern(mg: MarketGroup2, mgs: MarketGroup2[]) {
    const children = mgs
      .filter((m) => m.parent_group_id === mg.market_group_id)
      .sort((a, b) => a.market_group_id - b.market_group_id);
    if (children.length) {
      mg.children = children;
      children.forEach((c) => useChildern(c, mgs));
    }
    return mg;
  }
  const mgs: MarketGroup2[] = marketGroups.map((m) => ({
    ...m,
    children: [],
  }));
  const mgs2: MarketGroup2[] = mgs.filter((m) => !m.parent_group_id);
  return mgs2.map((m) => useChildern(m, mgs));
}

export async function getMarketGroupFromESI(): Promise<MarketGroup2[]> {
  const mgs: MarketGroup[] = [];
  // get market group
  const { data: mgIds } = await getMarketGroup();
  for (const mgId of mgIds) {
    const { data: mg } = await getMarketGroupById(mgId);
    mgs.push(mg);
  }
  MARKET_CACHE = getMarketGroupTree(mgs);
  localStorage.setItem(MARKET_GROUP_KEY, JSON.stringify(MARKET_CACHE));
  return MARKET_CACHE;
}

export async function getMarketGroupFromPublic(): Promise<MarketGroup2[]> {
  const res = await fetch("/js/market_groups.json");
  MARKET_CACHE = getMarketGroupTree((await res.json()) as MarketGroup[]);
  localStorage.setItem(MARKET_GROUP_KEY, JSON.stringify(MARKET_CACHE));
  return MARKET_CACHE;
}

export function getMarketGroupFromLocal(): MarketGroup2[] | undefined {
  if (MARKET_CACHE) return MARKET_CACHE;
  const mgss = localStorage.getItem(MARKET_GROUP_KEY);
  if (mgss) {
    MARKET_CACHE = JSON.parse(mgss);
    return MARKET_CACHE;
  }
}

const MARKET_ORDER_CACHE = new Map<number, MarketOrder[]>();

export async function getMarketOrder(typeId: number): Promise<MarketOrder[]> {
  const mos = MARKET_ORDER_CACHE.get(typeId);
  if (mos) return mos;
  const { data: mm } = await getMarketRegionOrder(typeId);
  MARKET_ORDER_CACHE.set(typeId, mm);
  return mm;
}
