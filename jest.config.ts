import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  projects: [
    "<rootDir>/server",
    "<rootDir>/packages/api-validator"
  ],
};

export default config;
