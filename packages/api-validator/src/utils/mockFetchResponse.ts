export const mockFetchResponse = (body = {}, status = 200, headers = {}) => () => {
  return Promise.resolve({
    ok: status <= 399,
    headers,
    status,
    json: () => Promise.resolve(body),
  });
};
