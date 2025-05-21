export type ManufactureItemSource = "manufacture" | "purchase" | "original";

export interface ManufactureProductType {
  type?: number;
  // for cascader
  maketType?: number[];
  quantity: number;
}

export interface ManufactureItemType {
  type: number;
  quantity: number;
  canManufacture?: boolean;
  isOriginal?: boolean;
  price?: number;
  source: ManufactureItemSource;
  incomes?: Array<ManufactureProductType>;
}
