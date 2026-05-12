/** Jest stub: real package ships ESM `.mjs` that Jest does not load by default. */
export function AllowAnonymous() {
  return <T extends abstract new (...args: never[]) => unknown>(target: T) => target;
}
