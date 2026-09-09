const { createDefaultEsmPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultEsmPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@entities/(.*)\\.js$": "<rootDir>/src/domain/entities/$1.ts",
    "^@value-objects/(.*)\\.js$": "<rootDir>/src/domain/value-objects/$1.ts",
    "^@domain/(.*)\\.js$": "<rootDir>/src/domain/$1.ts",
    "^@ports/(.*)\\.js$": "<rootDir>/src/application/ports/$1.ts",
    "^@dto/(.*)\\.js$": "<rootDir>/src/application/dto/$1.ts",
    "^@exceptions/(.*)\\.js$": "<rootDir>/src/domain/exceptions/$1.ts",
    "^@use-cases/(.*)\\.js$": "<rootDir>/src/application/use-cases/$1.ts",
    "^@adapters/(.*)\\.js$": "<rootDir>/src/infra/out/adapters/$1.ts",
    "^@controllers/(.*)\\.js$": "<rootDir>/src/infra/in/web/controllers/$1.ts",
    "^@factories/(.*)\\.js$": "<rootDir>/src/main/factories/$1.ts",
    "^@routes/(.*)\\.js$": "<rootDir>/src/infra/in/web/routes/$1.ts",
    "^@middlewares/(.*)\\.js$": "<rootDir>/src/infra/in/web/middlewares/$1.ts",
  },
  transform: {
    ...tsJestTransformCfg,
  },
};
