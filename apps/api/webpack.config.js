const path = require("node:path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

/** Bundle ESM-only auth packages into the Nest output (Vercel runs CJS). */
const ESM_AUTH_ALLOWLIST = [
  "@thallesp/nestjs-better-auth",
  /^better-auth(\/|$)/,
  /^@better-auth(\/|$)/,
  /^jose(\/|$)/,
  /^@noble\//,
  /^@better-fetch\//,
];

/** Optional peers of @thallesp/nestjs-better-auth — not installed in this API. */
const OPTIONAL_PEER_IGNORE = [
  /^@nestjs\/graphql$/,
  /^@nestjs\/websockets$/,
  /^graphql$/,
  /^fastify$/,
  /^socket\.io$/,
  /^socket\.io-client$/,
];

module.exports = (options) => ({
  ...options,
  entry: {
    main: options.entry,
    serverless: path.join(__dirname, "src/vercel.ts"),
  },
  output: {
    ...options.output,
    filename: "[name].js",
  },
  plugins: [
    ...(options.plugins ?? []),
    ...OPTIONAL_PEER_IGNORE.map(
      (resourceRegExp) => new webpack.IgnorePlugin({ resourceRegExp })
    ),
  ],
  externals: [
    nodeExternals({
      allowlist: ESM_AUTH_ALLOWLIST,
    }),
  ],
});
