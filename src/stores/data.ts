import type { CascaderOption } from "element-plus";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { MarketApi } from "../apis/esi";
import {
  getSdeBlueprints,
  getSdeMarketGroups,
  getSdeTypes,
  type SdeMarketGroup,
} from "../apis/sde";
import { getSdePlanetSchematics } from "../apis/sde/planet";

export interface Region {
  id: number;
  name: string;
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

export interface BlueprintMaterial {
  type: number;
  quantity: number;
}

export interface Blueprint {
  type: number;
  materials?: Array<BlueprintMaterial>;
  product: number;
  quantity: number;
  time: number;
}

export interface PlanetSchematic {
  materials?: Array<BlueprintMaterial>;
  product: number;
  quantity: number;
  time: number;
}

/**
 * blueprint options for select, value is blueprint type id
 */
function buildBlueprintOptions(
  blueprints: Record<number, Blueprint>,
  marketGroups: MarketGroup[],
): Array<CascaderOption> {
  const res: Array<CascaderOption> = [];
  for (const g of marketGroups) {
    let cc: Array<CascaderOption> = [];

    // add children
    if (g.children.length > 0) {
      cc = buildBlueprintOptions(blueprints, g.children);
    }

    // add types
    if (g.types.length > 0) {
      for (const t of g.types) {
        // check if type has blueprint
        if (!blueprints[t.id]) continue;
        cc.push({
          label: t.name,
          value: t.id,
        });
      }
    }

    // skip empty group
    if (!cc?.length) continue;

    res.push({
      label: g.name,
      value: g.id,
      children: cc,
    });
  }
  return res;
}

export const useDataStore = defineStore("data", () => {
  const m = new MarketApi();

  // type
  const types = ref<Record<string, string>>({});

  // market group
  const marketGroups = ref<Array<MarketGroup>>([]);
  async function initMarketGroups() {
    // init types
    const sts = await getSdeTypes();
    types.value = sts.reduce(
      (prev, curr) => {
        prev[curr.id] = curr.name ?? "Unknown";
        return prev;
      },
      {} as Record<string, string>,
    );

    // init market groups
    const smgs = await getSdeMarketGroups();
    const bmg: (sde: SdeMarketGroup) => MarketGroup = (sde: SdeMarketGroup) => {
      const id = parseInt(sde.id);
      return {
        id: id,
        name: sde.name,
        children: smgs.filter((g) => g.parentGroupID === id).map((g) => bmg(g)),
        types: sde.hasTypes
          ? sts
              .filter((t) => t.marketGroupID === id)
              .map((t) => ({ id: parseInt(t.id), name: t.name ?? "Unknown" }))
          : [],
      };
    };
    marketGroups.value = smgs
      .filter((g) => !g.parentGroupID)
      .map((g) => bmg(g));
  }
  initMarketGroups().catch((err) => {
    console.error("Init market groups error", err);
  });
  function readMarketGroup(id: number) {
    const fmg: (groups: MarketGroup[]) => MarketGroup | undefined = (
      groups,
    ) => {
      for (const g of groups) {
        if (g.id === id) return g;
        const child = fmg(g.children);
        if (child) return child;
      }
      return undefined;
    };

    return fmg(marketGroups.value);
  }

  // market prices, key is type id
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
  initMarketPrices().catch((err) => {
    console.error("Init market prices error", err);
  });

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

  // blueprint, key is product type id
  const blueprints = ref<Record<number, Blueprint>>({});
  async function initBlueprints() {
    const sbs = await getSdeBlueprints();
    blueprints.value = sbs.reduce(
      (prev, curr) => {
        // skip null products
        if (!curr.activities?.manufacturing?.products) return prev;

        if (curr.activities.manufacturing.products.length > 1) {
          console.warn(`Blueprint ${curr.id} has multiple products`);
        }

        const p = curr.activities.manufacturing.products[0];
        if (!p) return prev;
        const rr: Blueprint = {
          type: curr.blueprintTypeID,
          materials: curr.activities.manufacturing.materials?.map((m) => ({
            type: m.typeID,
            quantity: m.quantity,
          })),
          product: p.typeID,
          quantity: p.quantity,
          time: curr.activities.manufacturing.time,
        };
        prev[p.typeID] = rr;
        return prev;
      },
      {} as Record<number, Blueprint>,
    );
  }
  initBlueprints().catch((err) => {
    console.error("Init blueprints error", err);
  });
  const blueprintOptions = computed(() => {
    return buildBlueprintOptions(blueprints.value, marketGroups.value);
  });

  // planet
  const planetSchematics = ref<Record<number, PlanetSchematic>>({});
  async function initPlanetSchematics() {
    const spss = await getSdePlanetSchematics();
    planetSchematics.value = spss.reduce(
      (prev, curr) => {
        const rr: PlanetSchematic = {
          materials: [],
          product: 0,
          quantity: 0,
          time: curr.cycleTime,
        };
        for (const ts in curr.types) {
          const t = curr.types[ts];
          if (!t) continue;

          if (t.isInput) {
            rr.materials!.push({
              type: parseInt(ts),
              quantity: t.quantity,
            });
          } else {
            rr.product = parseInt(ts);
            rr.quantity = t.quantity;
          }
        }
        prev[rr.product] = rr;
        return prev;
      },
      {} as Record<number, PlanetSchematic>,
    );
  }
  initPlanetSchematics().catch((err) => {
    console.error("Init planet schematics error", err);
  });
  function readPlanetSchematic(type: number): PlanetSchematic | undefined {
    return planetSchematics.value[type];
  }

  // todo, Reactions

  return {
    // type
    types,
    // market
    marketGroups,
    readMarketGroup,
    marketPrices,
    readMarketOrders,
    readMarketHistory,
    // blueprint
    blueprints,
    blueprintOptions,
    // planet
    planetSchematics,
    readPlanetSchematic,
  };
});
