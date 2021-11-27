export type ValidateFunction<TInput> = (value: TInput, options?: any) => boolean;
export type TransformFunction<TInput, TOutput> = (
  value: TInput,
  options?: any
) => TOutput;
/** PathPrefix is a url path prefix (e.g. `/posts/latest`) */
export type PathRule<TInput, TOutput> =
  | TransformFunction<TInput, TOutput>
  | {
      response?: TransformFunction<TInput, TOutput> | ValidateFunction<TInput>;
      request?: TransformFunction<TInput, TOutput> | ValidateFunction<TInput>;
      // requestBody: TransformFunction<TInput, TOutput>;
      // requestHeaders: TransformFunction<TInput, TOutput>;
      // requestUrl: TransformFunction<TInput, TOutput>;
    };
