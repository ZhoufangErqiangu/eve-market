import { type Blueprint, type PlanetSchematic } from "../../stores/data";

export type ManufactureItemSource = "manufacture" | "purchase" | "original";

export interface ManufactureProductType {
  type?: number;
  // for cascader
  marketType?: number[];
  quantity: number;

  /**
   * manufacturing
   */
  blueprintId?: number;
  output?: number;
  materials?: ManufactureItemType[];
  time?: number;

  /**
   * purchase
   */
  price: number;
}

export function buildInitProduct(): ManufactureProductType {
  return {
    quantity: 0,
    price: 0,
  };
}

export function buildNewProduct(
  maketType: number[],
  quantity: number,
  readBlueprint: (product: number) => Blueprint | undefined,
  readPlanetSchematic: (product: number) => PlanetSchematic | undefined,
  readPrice: (type: number) => number,
): ManufactureProductType {
  const type = maketType[maketType.length - 1];
  if (!type) throw new Error("Null type");

  const b = readBlueprint(type);
  if (!b) throw new Error(`Blueprint for ${type} not found`);

  const cycles = Math.ceil(quantity / b.quantity);

  return {
    type: type,
    marketType: maketType,
    quantity: quantity,

    blueprintId: b.type,
    output: b.quantity,
    materials: b.materials?.map((m) =>
      buildNewItem(
        0,
        m.type,
        cycles * m.quantity,
        readBlueprint,
        readPlanetSchematic,
        readPrice,
      ),
    ),
    time: cycles * b.time,

    price: readPrice(type),
  };
}

export function calculateProductCost(product: ManufactureProductType): number {
  return (
    product.materials?.reduce((acc, m) => acc + calculateItemCost(m), 0) ?? 0
  );
}

export interface ManufactureItemType {
  recursion: number;
  type?: number;
  quantity: number;
  source: ManufactureItemSource;

  /**
   * manufacturing
   */
  blueprintId?: number;
  isPlanetSchematic?: boolean;
  output?: number;
  materials?: ManufactureItemType[];
  time?: number;

  /**
   * purchase
   */
  price: number;
}

export function buildNewItem(
  recursion: number,
  type: number,
  quantity: number,
  readBlueprint: (product: number) => Blueprint | undefined,
  readPlanetSchematic: (product: number) => PlanetSchematic | undefined,
  readPrice: (type: number) => number,
): ManufactureItemType {
  const b = readBlueprint(type);
  const ps = readPlanetSchematic(type);
  const p = readPrice(type);

  if (b) {
    const cycles = Math.ceil(quantity / b.quantity);

    return {
      recursion: recursion,
      type: type,
      quantity: quantity,
      source: "manufacture",

      blueprintId: b.type,
      output: b.quantity,
      materials: b.materials?.map((m) =>
        buildNewItem(
          recursion + 1,
          m.type,
          cycles * m.quantity,
          readBlueprint,
          readPlanetSchematic,
          readPrice,
        ),
      ),
      time: cycles * b.time,

      price: p,
    };
  } else if (ps) {
    const cycles = Math.ceil(quantity / ps.quantity);

    return {
      recursion: recursion,
      type: type,
      quantity: quantity,
      source: "manufacture",

      isPlanetSchematic: true,
      output: ps.quantity,
      materials: ps.materials?.map((m) =>
        buildNewItem(
          recursion + 1,
          m.type,
          cycles * m.quantity,
          readBlueprint,
          readPlanetSchematic,
          readPrice,
        ),
      ),
      time: cycles * ps.time,

      price: p,
    };
  } else {
    return {
      recursion: recursion,
      type: type,
      quantity: quantity,
      source: "purchase",

      price: p,
    };
  }
}

export function calculateItemCost(item: ManufactureItemType): number {
  if (item.source === "purchase") {
    return item.price * item.quantity;
  } else if (item.source === "manufacture" && item.materials) {
    return item.materials.reduce((acc, m) => acc + calculateItemCost(m), 0);
  } else {
    return 0;
  }
}
