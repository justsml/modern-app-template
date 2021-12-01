/* eslint-disable @typescript-eslint/no-redeclare */
import type { RequestInit, Response } from "node-fetch";
import { pathToRegexp } from "path-to-regexp";
import { HttpPathRules, Rules } from "..";

type RuleMatcher<TInput, TOutput> = (
  path: string,
  method: string
) => Rules<TInput, TOutput> | false;

function getPathMatcher<TInput, TOutput>(
  rules: HttpPathRules<TInput, TOutput>
): RuleMatcher<TInput, TOutput> {
  const paths = Object.keys(rules);

  const pathMatchers = paths.map((p) => ({
    path: p, // TODO: Add HTTP VERB Support here-ish
    pattern: pathToRegexp(p),
  }));

  return (inputPath: string, method: string) => {
    const matchingPath = pathMatchers.find(({ pattern }) =>
      pattern.test(inputPath)
    );
    const { path } = matchingPath || {};
    return path !== undefined ? rules[path] : false;
  };
}
export default function fetchFactory<TInput, TOutput>(
  validator: Rules<TInput, TOutput> | HttpPathRules<TInput, TOutput> | false
) {
  let pathMatcher: RuleMatcher<TInput, TOutput> | null = null;
  if (
    typeof validator === "object" &&
    !validator.request &&
    !validator.response
  ) {
    // We have some path patterns to match!
    pathMatcher = getPathMatcher(validator);
  }
  return function fetchWrapper(url: string, init: RequestInit = {}) {
    let _response: Response;
    if (pathMatcher !== null) {
      validator = pathMatcher(url, init.method || "GET");
    }
    let requestBodyValidator =
      typeof validator === "object" ? validator.request : undefined;
    let responseValidator =
      typeof validator === "function"
        ? validator
        : typeof validator === "object"
        ? validator.response
        : undefined;
    // check request body
    if (requestBodyValidator && typeof requestBodyValidator === "function") {
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
          if (responseValidator && typeof responseValidator === "function") {
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
