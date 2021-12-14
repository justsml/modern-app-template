# Examples of Testing Strategies

In this project we'll explore different ways to use fixtures (essentially static JSON objects.)

## Goals

1. Clarity in tests.
1. Tests should look more like actual implementation.
1. Explore helper functions to generate fixtures.

## Test Scoping Patterns: Examples

1. [Style 1: Inline Inputs & Outputs](/packages/demo-test-styles/src/index.style1.test.ts)
2. [Style 2: Local Helper Function](/packages/demo-test-styles/src/index.style2.test.ts)
3. [Style 3: Hierarchy & Scoped Tests](/packages/demo-test-styles/src/index.style3.test.ts)

## Project: Transaction Processor

We'll be given an array of transactions on which we'll perform operations.

### Requirements

- [x] `processTotals(txs: Transactions[])` - Calculate `total` per `BaseTransaction`, by adding `tax` and `tip` to a `total` field.

#### Stretch Tasks

- [ ] `sumTotal(txs: Transactions[])` - Sum of all `total`s in list of transactions.
- [ ] Detect invalid values (negative taxes, etc.)
- [ ] Group totals by category.

## Notes

### `expect()` Patterns

```ts
// ✅ Stable, inline values
expect(result[0].total).toBe(130.0);
expect(result[1].total).toBe(140.0);

// 🟡 No mutations*, direct field mapping to focus on the value that changed
expect(result.map(tx => tx.total)).toMatchObject([
  130.0,
  140.0,
]);

// 🔴 Repeated Calculations, may reference `result` variable
expect(result[0].total).toBe((100.0 * 1.1) + 20.0);
expect(result[1].total).toBe((100.0 * 1.1) + 30.0);
```
