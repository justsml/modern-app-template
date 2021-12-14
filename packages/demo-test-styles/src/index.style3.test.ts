import type { BaseTransaction, ComputedTransaction } from ".";
import { processTotals } from ".";

/*
Style 3: Hierarchy & Scoped Tests
*/

describe("processTotals", () => {
  describe("Unchanged subtotal, no tax or tip", () => {
    const txs = [
      {
        subTotal: 100.0,
        category: `Gifts`,
        date: "2021-12-01T01:02:03.456Z",
      },
      {
        subTotal: 100.0,
        category: `Lunch`,
        date: "2021-12-02T01:02:03.456Z",
      },
    ];

    it("can calculate total properties w/o tax & tip", () => {
      const result = processTotals(txs);
      expect(result[0].total).toBe(100.0);
      expect(result[1].total).toBe(100.0);
    });
  });

  describe("Tip & tax included", () => {
    const txs = [
      {
        subTotal: 100.0,
        tax: 10.0,
        category: `Gifts`,
        date: "2021-12-01T01:02:03.456Z",
      },
      {
        subTotal: 100.0,
        tax: 10.0,
        tip: 30.0,
        category: `Lunch`,
        date: "2021-12-02T01:02:03.456Z",
      },
    ];
    it("can calculate total properties, w/ tip & tax override", () => {
      const result = processTotals(txs);
      // 🟢 Expected values inline
      expect(result[0].total).toBe(110.0);
      expect(result[1].total).toBe(140.0);

      // 🔴 Expect values re-calculated by helper function
      const calculateTotal = ({subTotal, tax = 0, tip = 0}: BaseTransaction) => subTotal + tip + ((tax / 100) * subTotal);
      expect(result[0].total).toBe(calculateTotal(txs[0]));
      expect(result[1].total).toBe(calculateTotal(txs[1]));
    });
  });
});
