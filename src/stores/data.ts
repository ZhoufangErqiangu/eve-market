import { defineStore } from "pinia";
import { ref } from "vue";
import {
  type GetMarketsGroupsMarketGroupIdOk,
  MarketApi,
  UniverseApi,
} from "../apis/esi";
import { JsonSet } from "../utils/set";

const DATA_MARKET_GROUPS_KEY = "data.market.groups";
const DATA_REGIONS_KEY = "data.regions";
const DATA_NAMES_KEY = "data.names";

export interface MarketGroup {
  id: number;
  name: string;
  children: Array<MarketGroup>;
  types: Array<number>;
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

export const useDataStore = defineStore("data", () => {
  const m = new MarketApi();
  const u = new UniverseApi();

  // market group
  const mgss = localStorage.getItem(DATA_MARKET_GROUPS_KEY);
  const marketGroups = ref<Array<MarketGroup>>(mgss ? JSON.parse(mgss) : []);
  async function readMarketGroups() {
    // read all market groups
    const mgs = await m.getMarketsGroups();
    const mgls = new Array<GetMarketsGroupsMarketGroupIdOk>(mgs.length);
    for (let i = 0; i < mgs.length; i++) {
      const mg = await m.getMarketsGroupsMarketGroupId({
        marketGroupId: mgs[i]!,
      });
      mgls[i] = mg;
    }

    // build children
    function useChildren(
      parent?: GetMarketsGroupsMarketGroupIdOk,
    ): MarketGroup[] {
      return mgls
        .filter(
          parent
            ? (mg) => mg.parentGroupId === parent?.marketGroupId
            : (mg) => !mg.parentGroupId,
        )
        .map((mg) => {
          return {
            id: mg.marketGroupId,
            name: mg.name,
            children: useChildren(mg),
            types: mg.types,
          };
        });
    }

    marketGroups.value = useChildren();
    localStorage.setItem(
      DATA_MARKET_GROUPS_KEY,
      JSON.stringify(marketGroups.value),
    );
    return marketGroups.value;
  }
  function readMarketGroup(id: number) {
    function find(groups: MarketGroup[], id: number): MarketGroup | undefined {
      for (const group of groups) {
        if (group.id === id) return group;
        const child = find(group.children, id);
        if (child) return child;
      }
      return undefined;
    }
    return find(marketGroups.value, id);
  }

  // regions
  const rss = localStorage.getItem(DATA_REGIONS_KEY);
  const regions = ref<Array<Region>>(rss ? JSON.parse(rss) : []);
  async function readRegions() {
    const rs = await u.getUniverseRegions();
    const rls = new Array<Region>(rs.length);
    for (let i = 0; i < rs.length; i++) {
      const rid = rs[i]!;
      const r = await u.getUniverseRegionsRegionId({ regionId: rid });
      rls[i] = { id: rid, name: r.name };
    }
    regions.value = rls;
    localStorage.setItem(DATA_REGIONS_KEY, JSON.stringify(rls));
    return regions.value;
  }

  // names
  const nss = localStorage.getItem(DATA_NAMES_KEY);
  const names = ref<Record<number, string>>(nss ? JSON.parse(nss) : {});
  async function readNames(ids: number[]) {
    // avoid duplicate
    const idss = new JsonSet<number>(ids);

    // avoid local exists
    for (const id of idss) {
      if (names.value[id]) {
        idss.delete(id);
      }
    }

    if (!idss.size) return names.value;

    const ns = await u.postUniverseNames(
      { ids: idss },
      { headers: { "Content-Type": "application/json" } },
    );
    for (const n of ns) {
      names.value[n.id] = n.name;
    }
    localStorage.setItem(DATA_NAMES_KEY, JSON.stringify(names.value));
    return names.value;
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

  // delete data
  function deleteData() {
    marketGroups.value = [];
    localStorage.removeItem(DATA_MARKET_GROUPS_KEY);
    regions.value = [];
    localStorage.removeItem(DATA_REGIONS_KEY);
    names.value = {};
    localStorage.removeItem(DATA_NAMES_KEY);
  }

  return {
    // market
    marketGroups,
    readMarketGroups,
    readMarketGroup,
    marketPrices,
    readMarketOrders,

    // regions
    regions,
    readRegions,

    // names
    names,
    readNames,

    deleteData,
  };
});
