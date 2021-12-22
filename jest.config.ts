import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  projects: [
    "<rootDir>/packages/*"
  ],
  verbose: true,
};

export default config;
