import type { RequestInit, Response } from "node-fetch";

import { PathRule } from "..";

export default function fetchFactory<TInput, TOutput>(
  validator: PathRule<TInput, TOutput>
) {
  const requestBodyValidator =
    typeof validator === "object" ? validator.request : undefined;
  const responseValidator =
    typeof validator === "function" ? validator : validator.response;

  return function fetchWrapper(url: string, init: RequestInit = {}) {
    let _response: Response;
    // check request body
    if (requestBodyValidator) {
      // Currently only JSON is supported.
      if (typeof init.body === "string") {
        try {
          const body = JSON.parse(init.body);
          if (body) {
            const isValid = requestBodyValidator(body as any);
            if (!isValid) throw new TypeError(`Invalid request body`);
          }
        } catch (error) {
          return Promise.reject(error);
        }
      } else {
        throw new TypeError(
          `Unsupported body type. Validation only supports JSON encoded 'body'.`
        );
      }
    }
    return import("node-fetch").then(({ default: fetch }) => {
      return fetch(url, init)
        .then((response) => {
          // save response to replay later.
          _response = response.clone();
          return response.json() as any as TOutput;
        })
        .then((body: TOutput) => {
          // validate response
          if (responseValidator) {
            const validatorResult = responseValidator(body as any);
            if (!validatorResult)
              throw TypeError(`Invalid response body: ${JSON.stringify(body)}`);
          }
          // Replay the request back, fast since response already buffered.
          return _response;
        });
    });
  };
}
