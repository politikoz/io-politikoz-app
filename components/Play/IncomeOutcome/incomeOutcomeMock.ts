export interface Transaction {
    type: "KOZ" | "ADA" | "Tickets"; // 🔹 Garantimos que só aceita esses valores
    amount: number;
    source: string;
    category: "income" | "outcome"; // 🔹 Garantimos que só aceita esses valores
    timestamp: string;
  }
  
  // 🔹 Função para gerar datas dos últimos 12 meses
  const generateMockDate = (monthOffset: number): string => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthOffset);
    return date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  };
  
  // 🔹 Mock EXPLICITAMENTE TIPADO como `Transaction[]`
  export const mockIncomeOutcome: Transaction[] = [
    { type: "KOZ", amount: 500, source: "Bought KOZ", category: "income", timestamp: generateMockDate(0) },
    { type: "KOZ", amount: 300, source: "Stake Rewards", category: "income", timestamp: generateMockDate(0) },
    { type: "ADA", amount: 50, source: "Election Rewards", category: "income", timestamp: generateMockDate(0) },
    { type: "Tickets", amount: 5, source: "Earned from Engage", category: "income", timestamp: generateMockDate(0) },
    { type: "KOZ", amount: 100, source: "Bought Tickets", category: "outcome", timestamp: generateMockDate(0) },
    { type: "Tickets", amount: 3, source: "Bought Tickets", category: "outcome", timestamp: generateMockDate(0) },
    { type: "ADA", amount: 20, source: "Bought KOZ", category: "outcome", timestamp: generateMockDate(0) },
  ];
  
  // 🔹 Gerando dados dos últimos 11 meses e garantindo que TypeScript reconheça corretamente
  export const previousMonthsIncomeOutcome: Transaction[] = Array.from({ length: 11 }, (_, i) => i + 1).flatMap(
    (month): Transaction[] => [
      { type: "KOZ", amount: 400 - month * 10, source: "Bought KOZ", category: "income", timestamp: generateMockDate(month) },
      { type: "Tickets", amount: 3 + month, source: "Earned from Engage", category: "income", timestamp: generateMockDate(month) },
      { type: "ADA", amount: 10 + month * 5, source: "Election Rewards", category: "income", timestamp: generateMockDate(month) },
      { type: "KOZ", amount: 50 + month * 10, source: "Bought Tickets", category: "outcome", timestamp: generateMockDate(month) },
    ]
  );
  
  // 🔹 Juntamos os arrays
  export const fullMockIncomeOutcome: Transaction[] = [...mockIncomeOutcome, ...previousMonthsIncomeOutcome];
  