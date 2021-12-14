export const processTotals = (txs: BaseTransaction[]): ComputedTransaction[] => {
  return txs.map(calculateTotal);
};

function calculateTotal(tx: BaseTransaction): ComputedTransaction {
  let { subTotal, tip, tax } = tx;
  tip = tip ?? 0;
  tax = tax ?? 0;
  const taxAmount = (tax / 100.0) * subTotal;
  return {
    ...tx,
    total: subTotal + tip + taxAmount,
  };
}

export interface BaseTransaction {
  date: string,
  subTotal: number,
  tax?: number,
  tip?: number,
  category: string,
  description?: string,
}

export interface ComputedTransaction extends BaseTransaction {
  total: number,
}
