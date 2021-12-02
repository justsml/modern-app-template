# Example Coding Patterns

- [x] [HTTP Validators](/packages/api-validator) (Zod, Joi, ad-hoc function)
- [ ] Testing with variety of mocking strategies.
  - [x] [Shallow fakes](/packages/api-validator/src/utils/mockFetch.ts)
  - [ ] Using MSW, Mirage, or PollyJS.
    - [x] [PollyJS example](server/lib/github-api.test.ts)
- [ ] Pure unit tests.
- [x] Integrated [Server](/server) & [Client](/src) example.
- [x] Yarn workspaces (multi `package.json`, single `node_modules`.)
- [x] Multi-project Jest w/ GH Action runner.
