
export function esmWrapper<TModule>(module: TModule) {
  return () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => module),
  });
}

