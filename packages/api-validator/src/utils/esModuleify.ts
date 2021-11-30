
export function esModuleify<TModule>(module: TModule) {
  return () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => module),
  });
}

