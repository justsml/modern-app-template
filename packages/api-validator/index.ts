export { default as fetchValidationFactory } from "./src/fetchValidationFactory";

export type ValidateFunction<TInput> = (
  value: TInput,
  options?: any
) => boolean;
export type TransformFunction<TInput, TOutput> = (
  value: TInput,
  options?: any
) => TOutput;

/** PathPrefix is a url path prefix (e.g. `/posts/latest`) */
export type Rules<TInput, TOutput> =
  | TransformFunction<TInput, TOutput>
  | ValidateFunction<TInput>
  | {
      response?: TransformFunction<TInput, TOutput> | ValidateFunction<TInput>;
      request?: TransformFunction<TInput, TOutput> | ValidateFunction<TInput>;
      // requestBody: TransformFunction<TInput, TOutput>;
      // requestHeaders: TransformFunction<TInput, TOutput>;
      // requestUrl: TransformFunction<TInput, TOutput>;
    };

/** pathPattern is a key expression in the following format:
 *
 * ```ts
 * const pathRules = {
 *   `/users/:id?`: userSchemaCheck, // matches `/users/123` and `/users/`
 *   `POST:/messages`: { request: messageSchemaCheck }, // matches `/messages`
 * }
 * ```
 */
export type HttpPathRules<TInput, TOutput> = {
  [pathPattern: string]: Rules<TInput, TOutput>;
};

