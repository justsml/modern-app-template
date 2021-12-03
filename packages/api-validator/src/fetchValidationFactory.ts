/* eslint-disable @typescript-eslint/no-redeclare */
import type { HeadersInit, RequestInit, Response } from "node-fetch";
import { pathToRegexp } from "path-to-regexp";
import { HttpPathRules, Rules } from "..";

type RuleMatcher<TInput, TOutput> = (
  path: string,
  method: string
) => Rules<TInput, TOutput> | false;

type ValidationCallback = ({
  mode,
  error,
  data,
  url,
  status,
  headers,
}: {
  mode?: "response" | "request";
  error: Error;
  data: any;
  url: string;
  status?: number;
  headers?: HeadersInit;
}) => void;

type FetchFactoryOptions =
  | ValidationCallback
  | {
      callback: ValidationCallback;
      ignoreErrors?: boolean;
    };

/**
 *
 * ## Usage Examples
 *
 * ### Single Route, response validation
 *
 * Create a fetch wrapper to validate a single **response**.
 *
 * ```ts
 * const checkUser = (data) => data.user != undefined;
 * const fetch = fetchFactory(checkUser);
 * fetch('/users/1')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 * ```
 *
 * ### Single Route, request validation
 *
 * Create a fetch wrapper to validate a single **response**.
 *
 * ```ts
 * const checkUser = (data) => data.user != undefined;
 * const fetch = fetchFactory({ request: checkUser });
 * fetch('/users/1', { method: 'POST', body: JSON.stringify({ user: 'Dan' }) })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 * ```
 *
 * ### Multiple Routes
 *
 * Create a fetch wrapper for `/users/:id?` and POST's to `/messages`.
 *
 * ```ts
 * const pathRules = {
 *   // matches `/users/123` and `/users/`
 *   `/users/:id?`: userSchemaCheck,
 *   // matches POST's to `/messages`
 *   `POST:/messages`: { request: messageSchemaCheck },
 * }
 * export default fetchFactory(pathRules);
 * ```
 *
 * @param validator
 * @returns
 */
export default function fetchFactory<TInput, TOutput>(
  validator: Rules<TInput, TOutput> | HttpPathRules<TInput, TOutput> | false,
  options?: FetchFactoryOptions
) {
  let callback =
    typeof options === "function" ? options : options?.callback ?? (() => {});
  let ignoreErrors = typeof options === "object" ? options.ignoreErrors : false;
  let pathMatcher: RuleMatcher<TInput, TOutput> | null = null;

  // Check for path matcher input
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
      try {
        // Currently only JSON is supported.
        if (typeof init.body === "string") {
          try {
            const body = JSON.parse(init.body);
            if (body) {
              const isValid = requestBodyValidator(body as any);
              if (!isValid) throw new TypeError(`Invalid request body`);
            }
          } catch (error) {
            throw error;
          }
        } else {
          throw new TypeError(
            `Unsupported body type. Validation only supports JSON encoded 'body'.`
          );
        }
      } catch (error) {
        callback({
          mode: "request",
          error,
          data: init.body,
          url,
          headers: init.headers,
        });
        if (!ignoreErrors) throw error;
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
            try {
              const validatorResult = responseValidator(body as any);
              if (!validatorResult)
                throw TypeError(
                  `Invalid response body: ${JSON.stringify(body)}`
                );
            } catch (error) {
              callback({
                mode: "response",
                error,
                data: init.body,
                url,
                headers: _response.headers,
                status: _response.status,
              });
              if (!ignoreErrors) throw error;
            }
          }
          // Replay the request back. (fast since response already buffered.)
          return _response;
        });
    });
  };
}

const urlFragment = /^([a-z-]+:)?\/\//i;

function getPathMatcher<TInput, TOutput>(
  rules: HttpPathRules<TInput, TOutput>
): RuleMatcher<TInput, TOutput> {
  const paths = Object.keys(rules);

  const pathMatchers = paths.map((p) => ({
    key: p,
    method: getMethodPrefix(p),
    path: getPathExtracted(p), // TODO: Add HTTP VERB Support here-ish
    pattern: pathToRegexp(getPathExtracted(p)),
  }));

  return (inputPath: string, inputMethod: string = "get") => {
    inputMethod = (inputMethod).toLowerCase();
    // Check for URL, extract path if it exists.
    if (urlFragment.test(inputPath)) {
      const url = new URL(inputPath);
      inputPath = url.pathname;
    }

    const matchingPath = pathMatchers.find(({ pattern }) =>
      pattern.test(inputPath)
    );
    const { path, key, method } = matchingPath || {};
    return path !== undefined && inputMethod === method ? rules[key!] : false;
  };
}

function getMethodPrefix(path: string) {
  let verb = (path.replace(/^([a-z-]*):?.*/gi, "$1") || "get").toLowerCase();
  if (verb.startsWith('http')) verb = 'get';
  return verb;
}

function getPathExtracted(path: string) {
  let verb = (path.replace(/^([a-z-]*):?(.*)$/gi, "$2") || "/////").toLowerCase();
  if (verb.startsWith('http')) verb = 'get';
  return verb;
}
