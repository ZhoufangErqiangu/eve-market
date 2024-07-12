export type Params = Record<
  string,
  | string
  | symbol
  | boolean
  | number
  | bigint
  | undefined
  | null
  | Record<string | symbol, unknown>
  | unknown[]
  | object
>;

/**
 * build query string
 * @param params params
 * @param option option
 * @returns query string
 */
export function buildQueryString(
  params: Params,
  option: { sort?: number } = {},
) {
  const keys = Object.keys(params);
  if (option.sort && option.sort > 0) {
    keys.sort();
  } else if (option.sort && option.sort < 0) {
    keys.sort().reverse();
  }
  const list: string[] = [];
  keys.forEach((key) => {
    let temp: string;
    switch (typeof params[key]) {
      case "string":
        temp = params[key] as string;
        break;
      case "number":
      case "bigint":
        temp = (params[key] as number | bigint).toString();
        break;
      case "boolean":
        temp = (params[key] as boolean) ? "true" : "false";
        break;
      case "symbol":
        temp = (params[key] as symbol).toString();
        break;
      case "undefined":
        return;
      case "object":
        temp = JSON.stringify(params[key] as object);
        break;
      case "function":
        return;
      default:
        return;
    }
    list.push(`${key}=${temp}`);
  });
  return list.join("&");
}
