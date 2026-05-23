const expenseKeys = {
  all: (timeframe: string) => ["expenses", timeframe] as const,
};

export default expenseKeys;
