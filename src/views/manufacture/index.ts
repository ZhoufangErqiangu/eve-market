export type ManufactureItemSource = "manufacture" | "purchase" | "original";

export interface ManufactureProductType {
  type?: number;
  // for cascader
  maketType?: number[];
  quantity: number;
}

export interface ManufactureItemType {
  type?: number;
  quantity: number;
  price?: number;
  source: ManufactureItemSource;
}

export interface ManufactureLayerType {
  id: string;
  items: ManufactureItemType[];
}
