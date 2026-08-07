const { createDefaultEsmPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultEsmPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^@domain/(.*)\\.js$": "<rootDir>/src/domain/$1.ts",
  },
  transform: {
    ...tsJestTransformCfg,
  },
};
