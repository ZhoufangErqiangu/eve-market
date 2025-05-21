import { defineStore } from "pinia";
import { ref } from "vue";
import { MarketApi } from "../apis/esi";
import SdeBlueprintJson from "../assets/json/sde-blueprints.json";
import SdeMarketGroupsJson from "../assets/json/sde-marketgroups.json";
import SdeTypesJson from "../assets/json/sde-types.json";

export interface Region {
  id: number;
  name: string;
}

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

interface SdeBlueprint {
  id: string;
  blueprintTypeID: number;
  activities: {
    manufacturing: {
      materials?: Array<{ quantity: number; typeID: number }>;
      products?: Array<{ quantity: number; typeID: number }>;
      time: number;
    };
  };
}

export interface ManufactureBlueprintMaterial {
  type: number;
  quantity: number;
}

export interface ManufactureBlueprint {
  type: number;
  materials?: Array<ManufactureBlueprintMaterial>;
  product: number;
  quantity: number;
  time: number;
}

function buildManufactureBlueprints(): [
  Record<number, ManufactureBlueprint>,
  Record<number, ManufactureBlueprint>,
] {
  const byType: Record<number, ManufactureBlueprint> = {};
  const byProduct: Record<number, ManufactureBlueprint> = {};

  for (const b of Object.values(SdeBlueprintJson) as SdeBlueprint[]) {
    // skip null products
    if (!b.activities?.manufacturing?.products) continue;

    if (b.activities.manufacturing.products.length > 1) {
      console.warn(`Blueprint ${b.id} has multiple products`);
    }

    const p = b.activities.manufacturing.products[0];
    if (!p) continue;
    const rr: ManufactureBlueprint = {
      type: b.blueprintTypeID,
      materials: b.activities.manufacturing.materials?.map((m) => ({
        type: m.typeID,
        quantity: m.quantity,
      })),
      product: p.typeID,
      quantity: p.quantity,
      time: b.activities.manufacturing.time,
    };
    byType[b.blueprintTypeID] = rr;
    byProduct[p.typeID] = rr;
  }

  return [byType, byProduct];
}

interface BlueprintOption {
  label: string;
  value: number;
  children?: Array<BlueprintOption>;
}

/**
 * blueprint options for select, value is blueprint type id
 */
function buildBlueprintOptions(
  blueprints: Record<number, ManufactureBlueprint>,
  marketGroups: MarketGroup[],
): Array<BlueprintOption> {
  const res: Array<BlueprintOption> = [];
  for (const g of marketGroups) {
    let cc: Array<BlueprintOption> = [];

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

  // market group
  const marketGroups = buildMarketGroups();
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

    return fmg(marketGroups);
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

  // blueprint
  const [blueprints, blueprintsByProduct] = buildManufactureBlueprints();
  function readBlueprint(type: number): ManufactureBlueprint | undefined {
    return blueprints[type];
  }
  function readBlueprintByProduct(
    product: number,
  ): ManufactureBlueprint | undefined {
    return blueprintsByProduct[product];
  }
  const blueprintOptions = buildBlueprintOptions(
    blueprintsByProduct,
    marketGroups,
  );

  return {
    // market
    marketGroups,
    readMarketGroup,
    marketPrices,
    readMarketOrders,
    readMarketHistory,
    // type
    readTypeName,
    // blueprint
    readBlueprint,
    readBlueprintByProduct,
    blueprintOptions,
  };
});
