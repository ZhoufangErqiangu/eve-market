export function n2b(n: number, decimals: number | bigint): bigint {
  const ns = n.toString();
  let [int, dec] = ns.split(".");
  if (int === "0") int = "";
  if (!dec) dec = "";
  if (dec.length <= Number(decimals)) {
    dec = dec.padEnd(Number(decimals), "0");
  } else {
    dec = dec.slice(0, Number(decimals));
  }
  return BigInt(`${int}${dec}`);
}

export function b2n(b: bigint, decimals: number | bigint): number {
  const bs = b.toString();
  if (bs.length <= Number(decimals)) {
    return parseFloat(`0.${bs.padStart(Number(decimals), "0")}`);
  } else {
    return parseFloat(
      `${bs.slice(0, bs.length - Number(decimals))}.${bs.slice(
        bs.length - Number(decimals),
      )}`,
    );
  }
}

export function fixDecimals(n: number, decimals: number = 3): number {
  return Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function formatNumber(n: number, decimals: number = 2): string {
  return n.toLocaleString("en-US", {
    style: "decimal",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
