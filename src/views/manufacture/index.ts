export type ManufactureItemSource = "manufacture" | "purchase" | "original";

export class ManufactureItem {
  type: string;
  name: string;
  quantity: number;
  price?: number;
  source: ManufactureItemSource;

  constructor(
    type: string,
    name: string,
    quantity: number,
    price?: number,
    source: ManufactureItemSource = "manufacture",
  ) {
    this.type = type;
    this.name = name;
    this.quantity = quantity;
    this.price = price;
    this.source = source;
  }
}

export type ManufactureNodeType = "terminal" | "produce" | "aggregate";

export abstract class ManufactureNode {
  id: string;
  type: ManufactureNodeType;
  outcome: ManufactureItem[];

  constructor(
    id: string,
    type: ManufactureNodeType,
    outcome: ManufactureItem[],
  ) {
    this.id = id;
    this.type = type;
    this.outcome = outcome;
  }

  // getter
  income?: ManufactureItem[];
}

export class ManufactureTerminal extends ManufactureNode {
  constructor(id: string, outcome: ManufactureItem[]) {
    super(id, "terminal", outcome);
  }
}
