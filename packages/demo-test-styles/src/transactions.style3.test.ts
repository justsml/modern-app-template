import { BaseTransaction } from ".";
import { processTotals } from "./transactions";

/*
Style 3: Hierarchy & Scoped Tests
*/

const mockTransactions = (
  row1: Partial<BaseTransaction> = {},
  row2: Partial<BaseTransaction> = {}
) => {
  return [
    {
      subTotal: 100.0,
      category: `Gifts`,
      date: "2021-12-01T01:02:03.456Z",
      ...row1,
    },
    {
      subTotal: 100.0,
      category: `Lunch`,
      date: "2021-12-02T01:02:03.456Z",
      ...row2,
    },
  ];
};

describe("processTotals", () => {
  it("can calculate total properties w/o tax & tip", () => {
    const result = processTotals(mockTransactions());
    expect(result[0].total).toBe(100.0);
    expect(result[1].total).toBe(100.0);
  });

  it("can calculate total properties, w/ tip & tax override", () => {
    const result = processTotals(
      mockTransactions(
        {
          tax: 10.0,
          tip: 20.0,
        },
        {
          tax: 10.0,
          tip: 30.0,
        }
      )
    );
    expect(result[0].total).toBe(130.0);
    expect(result[1].total).toBe(140.0);
  });
});
