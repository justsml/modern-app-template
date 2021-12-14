# Example Coding Patterns

- [x] [HTTP Validators](/packages/api-validator) (Zod, Joi, ad-hoc function)
- [x] Testing with variety of mocking strategies.
  - [x] [Shallow fakes](/packages/api-validator/src/utils/mockFetch.ts),
  - [x] [PollyJS](/server/lib/github-api.test.ts),
  - [ ] MSW,
  - [ ] Mirage.
- [x] Pure unit tests.
  - [x] [Test Scoping Patterns: Examples](/packages/demo-test-styles)
    1. [Style 1: Inline Inputs & Outputs](/packages/demo-test-styles/src/index.style1.test.ts)
    2. [Style 2: Local Helper Function](/packages/demo-test-styles/src/index.style2.test.ts)
    3. [Style 3: Hierarchy & Scoped Tests](/packages/demo-test-styles/src/index.style3.test.ts)
- [x] Integrated [Server](/server) & [Client](/src) example.
- [x] Yarn workspaces (multi `package.json`, single `node_modules`.)
- [x] Multi-project Jest w/ GH Action runner.
