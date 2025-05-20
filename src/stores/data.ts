import { defineStore } from "pinia";
import { ref } from "vue";
import { MarketApi } from "../apis/esi";
import SdeMarketGroupsJson from "../assets/json/sde-marketgroups.json";
import SdeTypesJson from "../assets/json/sde-types.json";

interface SdeMarketGroup {
  id: string;
  name: string;
  hasTypes: boolean;
  parentGroupID?: number;
}

interface SdeType {
  id: string;
  name?: string;
  marketGroupID?: number;
}

export interface MarketType {
  id: number;
  name: string;
}

export interface MarketGroup {
  id: number;
  name: string;
  children: Array<MarketGroup>;
  types: Array<MarketType>;
}

/**
 * build market groups from SDE
 * @returns market groups
 */
function buildMarketGroups(): Array<MarketGroup> {
  const ss = Object.values(SdeMarketGroupsJson) as Array<SdeMarketGroup>;
  const tt = Object.values(SdeTypesJson) as Array<SdeType>;

  const bmg: (sde: SdeMarketGroup) => MarketGroup = (sde: SdeMarketGroup) => {
    const id = parseInt(sde.id);
    return {
      id: id,
      name: sde.name,
      children: ss.filter((g) => g.parentGroupID === id).map((g) => bmg(g)),
      types: sde.hasTypes
        ? tt
            .filter((t) => t.marketGroupID === id)
            .map((t) => ({ id: parseInt(t.id), name: t.name ?? "" }))
        : [],
    };
  };

  return ss.filter((g) => !g.parentGroupID).map((g) => bmg(g));
}

export interface Region {
  id: number;
  name: string;
}

export interface MarketPrice {
  id: number;
  adj: number;
  avg: number;
}

export interface MarketOrder {
  id: number;
  type: number;
  isBuy: boolean;
  price: number;
  minQuantity: number;
  totalQuantity: number;
  remainQuantity: number;
  createdAt: Date;
  duration: number;
}

export interface MarketHistory {
  date: Date;
  avg: number;
  high: number;
  low: number;
  count: number;
  volume: number;
}

export const useDataStore = defineStore("data", () => {
  const m = new MarketApi();

  // market group
  const marketGroups = ref<Array<MarketGroup>>(buildMarketGroups());
  function findMarketGroup(
    groups: MarketGroup[],
    id: number,
  ): MarketGroup | undefined {
    for (const group of groups) {
      if (group.id === id) return group;
      const child = findMarketGroup(group.children, id);
      if (child) return child;
    }
    return undefined;
  }
  function readMarketGroup(id: number) {
    return findMarketGroup(marketGroups.value, id);
  }

  // market prices
  const marketPrices = ref<Record<number, MarketPrice>>({});
  async function initMarketPrices() {
    const ps = await m.getMarketsPrices();
    for (const p of ps) {
      marketPrices.value[p.typeId] = {
        id: p.typeId,
        adj: p.adjustedPrice ?? 0.0,
        avg: p.averagePrice ?? 0.0,
      };
    }
  }
  initMarketPrices();

  // market orders
  async function readMarketOrders(
    region: number,
    type: number,
    direction: "buy" | "sell" | "all" = "all",
  ): Promise<Array<MarketOrder>> {
    const os = await m.getMarketsRegionIdOrders({
      regionId: region,
      typeId: type,
      orderType: direction,
    });
    return os.map((o) => {
      return {
        id: o.orderId,
        type: o.typeId,
        isBuy: o.isBuyOrder,
        price: o.price,
        minQuantity: o.minVolume,
        totalQuantity: o.volumeTotal,
        remainQuantity: o.volumeRemain,
        createdAt: new Date(o.issued),
        duration: o.duration,
      };
    });
  }

  // market history
  async function readMarketHistory(
    region: number,
    type: number,
  ): Promise<Array<MarketHistory>> {
    const hs = await m.getMarketsRegionIdHistory({
      regionId: region,
      typeId: type,
    });
    return hs.map((h) => {
      return {
        date: new Date(h.date),
        avg: h.average,
        high: h.highest,
        low: h.lowest,
        count: h.orderCount,
        volume: h.volume,
      };
    });
  }

  // type
  function readTypeName(id: string): string | undefined {
    return (SdeTypesJson as Record<string, SdeType>)[id]?.name;
  }

  return {
    // market
    marketGroups,
    readMarketGroup,
    marketPrices,
    readMarketOrders,
    readMarketHistory,
    // type
    readTypeName,
  };
});
