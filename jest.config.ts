import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  verbose: true,
  // transform: {},
  // @ts-ignore
  globals: {
    'ts-jest': {
      useESM: true,
    },
  }
};

export default config;
