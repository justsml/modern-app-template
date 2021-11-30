import path from "path";
import { Polly } from "@pollyjs/core";
import NodeHttpAdapter from "@pollyjs/adapter-node-http";
import FetchAdapter from "@pollyjs/adapter-fetch";
import FSPersister from "@pollyjs/persister-fs";
import { setupPolly } from "setup-polly-jest";

Polly.register(FetchAdapter);
Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

/* istanbul ignore next */
const pollyMode = process.env.POLLY_RECORD ? "record" : "replay";

export default function autoSetupPolly() {
  return setupPolly({
    adapters: ["node-http"],
    logging: false,
    mode: pollyMode,
    expiresIn: "10d",
    // expiryStrategy: 'error',
    recordIfMissing: true,
    recordFailedRequests: true,
    persister: "fs",
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, "../__recordings__"),
      },
    },
  });
}
