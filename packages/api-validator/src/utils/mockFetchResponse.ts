import type { Response } from "node-fetch";
import { Headers } from "node-fetch";

export const mockFetchResponse =
  (
    { url = "/", body = {}, status = 200, headers = {} } = {
      url: "/",
      body: {},
      status: 200,
      headers: {},
    }
  ): Promise<
    Omit<Response, "type" | "textConverted" | "body" | "bodyUsed" | "clone">
  > => {
    return Promise.resolve({
      ok: status <= 399,
      statusText: "OK",
      headers: new Headers(headers),
      status,
      arrayBuffer: () => Promise.resolve(Buffer.from(JSON.stringify(body))),
      buffer: () => Promise.resolve(Buffer.from(JSON.stringify(body))),
      blob: () => Promise.resolve(new Blob([JSON.stringify(body)])),
      json: () => Promise.resolve(body),
      text: () => Promise.resolve(JSON.stringify(body)),
      clone: () => mockFetchResponse({ url, body, status, headers }),
      redirected: false,
      size: JSON.stringify(body).length,
      url,
      timeout: 0,
    });
  };
