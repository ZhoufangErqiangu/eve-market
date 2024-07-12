import { service } from ".";
import { THE_FORGE_ID } from "./region";

export interface MarketGroup {
  market_group_id: number;
  name: string;
  description: string;
  types: number[];
  parent_group_id: number;
}

export interface MarketPrice {
  adjusted_price: number;
  average_price: number;
  type_id: number;
}

export async function getMarketGroup() {
  return await service.request<number[]>({
    url: "/markets/groups",
    method: "get",
  });
}

export async function getMarketGroupById(id: number, language?: string) {
  return await service.request<MarketGroup>({
    url: `/markets/groups/${id}`,
    method: "get",
    params: {
      language,
    },
  });
}

export async function getMarketPrice() {
  return await service.request<MarketPrice[]>({
    url: "/markets/prices",
    method: "get",
  });
}

export interface MarketOrder {
  duration: number;
  is_buy_order: boolean;
  issued: string;
  location_id: number;
  min_volume: number;
  order_id: number;
  price: number;
  range: string;
  system_id: number;
  type_id: number;
  volume_remain: number;
  volume_total: number;
}

/**
 * Return a list of orders in a region
 *
 * https://ali-esi.evepc.163.com/ui/#/Market/get_markets_region_id_orders
 */
export async function getMarketRegionOrder(
  typeId: number,
  orderType: "buy" | "sell" | "all" = "all",
  page = 1,
  regionId: number = THE_FORGE_ID,
) {
  return await service.request<MarketOrder[]>({
    url: `/markets/${regionId}/orders`,
    method: "get",
    params: {
      type_id: typeId,
      order_type: orderType,
      page,
    },
  });
}
