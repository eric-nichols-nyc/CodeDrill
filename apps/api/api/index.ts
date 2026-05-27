/**
 * Vercel serverless entry — must load webpack output, not ../src (CJS + ESM break).
 * Built by `nest build` as dist/serverless.js.
 */
export { default } from "../dist/serverless";
