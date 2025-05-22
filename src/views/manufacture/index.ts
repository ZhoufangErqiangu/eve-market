import type { ManufactureBlueprint } from "../../stores/data";

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
  readBlueprint: (product: number) => ManufactureBlueprint | undefined,
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
      buildNewItem(m.type, cycles * m.quantity, readBlueprint, readPrice),
    ),
    time: cycles * b.time,

    price: readPrice(type),
  };
}

export function calculateProductCost(product: ManufactureProductType): number {
  const cal: (i: ManufactureItemType) => number = (i: ManufactureItemType) => {
    if (i.source === "purchase") {
      return i.price * i.quantity;
    } else if (i.source === "manufacture" && i.materials) {
      return i.materials.reduce((acc, m) => acc + cal(m), 0);
    } else {
      return 0;
    }
  };

  return product.materials?.reduce((acc, m) => acc + cal(m), 0) ?? 0;
}

export interface ManufactureItemType {
  type?: number;
  quantity: number;
  source: ManufactureItemSource;

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

export function buildNewItem(
  type: number,
  quantity: number,
  readBlueprint: (product: number) => ManufactureBlueprint | undefined,
  readPrice: (type: number) => number,
): ManufactureItemType {
  const b = readBlueprint(type);
  const p = readPrice(type);

  if (!b) {
    return {
      type: type,
      quantity: quantity,
      source: "purchase",

      price: p,
    };
  } else {
    const cycles = Math.ceil(quantity / b.quantity);

    return {
      type: type,
      quantity: quantity,
      source: "manufacture",

      blueprintId: b.type,
      output: b.quantity,
      materials: b.materials?.map((m) =>
        buildNewItem(m.type, cycles * m.quantity, readBlueprint, readPrice),
      ),
      time: cycles * b.time,

      price: p,
    };
  }
}
