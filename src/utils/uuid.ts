let count = 0;

/**
 * generate uuid
 *
 * !!WARNNING!! this function has side effect
 * @returns uuid
 */
export function uuid(): string {
  count += 1;
  if (count > 999999) count = 0;
  return `${count.toString().padStart(6, "0")}-${Date.now().toString().slice(-6)}`;
}
