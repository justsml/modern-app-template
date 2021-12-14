import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  rootDir: ".",
  preset: "ts-jest",
  // verbose: true,
  testPathIgnorePatterns: ["node_modules", "dist"],
  resetMocks: true,
  resetModules: true,
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  testEnvironment: "node",
  transform: {},
};

export default config;
