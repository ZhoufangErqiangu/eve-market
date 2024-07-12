import { getMarketPrice, type MarketPrice } from "../apis/esi/market";

export const PRICE_KEY = "price";
const PRICE_CACHE = new Map<number, MarketPrice>();

function init() {
  const ps = localStorage.getItem(PRICE_KEY);
  if (ps) {
    const prices: MarketPrice[] = JSON.parse(ps);
    prices.forEach((p) => PRICE_CACHE.set(p.type_id, p));
  }
}
init();

export async function initPriceCacheFromESI() {
  const { data: ps } = await getMarketPrice();
  localStorage.setItem(PRICE_KEY, JSON.stringify(ps));
  ps.forEach((p) => PRICE_CACHE.set(p.type_id, p));
}

export function getPrice(id: number) {
  return PRICE_CACHE.get(id);
}
