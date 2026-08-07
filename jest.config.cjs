const { createDefaultEsmPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultEsmPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^@domain/(.*)\\.js$": "<rootDir>/src/domain/$1.ts",
    "^@ports/(.*)\\.js$": "<rootDir>/src/application/ports/$1.ts",
    "^@dto/(.*)\\.js$": "<rootDir>/src/application/dto/$1.ts",
    "^@exceptions/(.*)\\.js$": "<rootDir>/src/domain/exceptions/$1.ts",
  },
  transform: {
    ...tsJestTransformCfg,
  },
};
