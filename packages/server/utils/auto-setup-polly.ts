import path from "path";
import { Polly } from "@pollyjs/core";
import NodeHttpAdapter from "@pollyjs/adapter-node-http";
import FSPersister from "@pollyjs/persister-fs";
import { setupPolly } from "setup-polly-jest";

// import FetchAdapter from "@pollyjs/adapter-fetch";
// Polly.register(FetchAdapter);

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

/* istanbul ignore next */
const pollyMode = process.env.POLLY_MODE ? "record" : "replay";

export default function autoSetupPolly() {
  return setupPolly({
    adapters: ["node-http"],
    logging: false,
    mode: pollyMode,
    flushRequestsOnStop: true,
    // expiresIn: "10d",
    // expiryStrategy: 'error',
    recordIfMissing: true,
    recordFailedRequests: true,
    persister: "fs",
    matchRequestsBy: {
      url: true,
      body: true,
      method: true,
    },
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, "../__recordings__"),
      },
    },
  });
}
