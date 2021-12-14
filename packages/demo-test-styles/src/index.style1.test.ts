import { processTotals } from ".";

/*
Style 1: Inline Inputs & Outputs
*/

describe("processTotals", () => {
  it("can calculate total properties w/o tax & tip", () => {
    const result = processTotals([
      {
        subTotal: 100.0,
        category: `Gifts`,
        date: "2021-12-01T01:02:03.456Z",
      },
      {
        subTotal: 100.0,
        tip: 10.0,
        tax: 5.0,
        category: `Lunch`,
        date: "2021-12-02T01:02:03.456Z",
      },
    ]);
    expect(result[0].total).toBe(100.0);
    expect(result[1].total).toBe(115.0);
  });

  it("can calculate total properties, w/ tip & tax override", () => {
    const txs = [
      {
        subTotal: 100.0,
        tax: 10.0,
        tip: 20.0,
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
    const result = processTotals(txs);
    
    // ✅ Stable, inline values
    expect(result[0].total).toBe(130.0);
    expect(result[1].total).toBe(140.0);

    // 🟡 No mutations*, direct field mapping
    expect(result.map(tx => tx.total)).toMatchObject([
      130.0,
      140.0,
    ]);

    // 🔴 Repeated Calculations
    expect(result[0].total).toBe((100.0 * 1.1) + 20.0);
    expect(result[1].total).toBe((100.0 * 1.1) + 30.0);

  });
});
