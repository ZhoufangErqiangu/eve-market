/**
 * get element pos top left to page
 * @param el element
 * @returns element top left to page
 */
export function getElementTopLeft(el: HTMLElement) {
  let actualTop = el.offsetTop;
  let actualLeft = el.offsetLeft;
  let current = el.offsetParent as HTMLElement | null;
  while (current !== null) {
    if (!current) break;
    actualTop += current.offsetTop;
    actualLeft += current.offsetLeft;
    current = current.offsetParent as HTMLElement | null;
  }
  return { actualTop, actualLeft };
}
