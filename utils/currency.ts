export const roundKozUp = (amount: number): number => {
  return Math.ceil(amount);
};

export const calculateKozFromAda = (adaAmount: number, conversionRate: number): number => {
  return roundKozUp(adaAmount * conversionRate);
};