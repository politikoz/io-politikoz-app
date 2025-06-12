export const formatTreasuryValue = (value: number): string => {
  // Arredonda para baixo para o milhar mais próximo
  const roundedValue = Math.floor(value / 1000) * 1000;
  
  if (roundedValue >= 1000000) {
    return `${Math.floor(roundedValue / 1000000)}M`;
  }
  
  return `${Math.floor(roundedValue / 1000)}K`;
};

export const formatTokenAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatTxHash = (hash: string): string => {    
    return `${hash.slice(0, 3)}...${hash.slice(-3)}`;
};

export const isPendingExpired = (createdAt: string): boolean => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - created.getTime()) / (1000 * 60);
    return diffMinutes > 20;
};