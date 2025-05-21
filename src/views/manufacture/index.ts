export type ManufactureItemSource = "manufacture" | "purchase" | "original";

export interface ManufactureItem {
  type?: number;
  quantity: number;
  price?: number;
  source: ManufactureItemSource;
}

export interface ManufactureLayer {
  id: string;
  items: ManufactureItem[];
}
