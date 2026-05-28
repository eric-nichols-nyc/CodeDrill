/** @type {import("jest").Config} */
module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/../tsconfig.json",
      },
    ],
  },
  collectCoverageFrom: ["**/*.(t|j)s", "!**/*.spec.ts"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/../test/jest.setup.ts"],
  transformIgnorePatterns: [
    "/node_modules/(?!(@neondatabase/serverless|drizzle-orm)/)",
  ],
};
