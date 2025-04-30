export interface Politikoz {
    name: string;
    role: string;
    place: number;
    earnings: number;
    stamina: number;
    winningPosition: boolean;
    outOfStamina: boolean;
    isUser: boolean;
  }
  
  // 🔹 Definição das Cargos Políticos
  const roles = [
    "President",
    "Senator",
    "Minister",
    "Governor",
    "Federal Deputy",
    "State Deputy",
    "Mayor",
    "Councilor",
  ];
  
  // 🔹 Função para gerar um Politikoz aleatório
  const generatePolitikoz = (index: number): Politikoz => {
    const earnings = Math.floor(Math.random() * (10000 - 1000) + 1000); // Entre 1000 e 10.000
    const stamina = Math.floor(Math.random() * 101); // Entre 0 e 100
    const role = roles[Math.floor(Math.random() * roles.length)];
    const place = index + 1;
    const winningPosition = Math.random() < 0.5; // 50% de chance de ser um vencedor
    const outOfStamina = stamina === 0; // Sem energia se stamina for 0
    const isUser = Math.random() < 0.1; // 10% de chance de ser do usuário
  
    return {
      name: `#${String(index + 1).padStart(5, "0")}`,
      role,
      place,
      earnings,
      stamina,
      winningPosition,
      outOfStamina,
      isUser,
    };
  };
  
  // 🔹 Gerar 10.000 Politikoz
  export const politikozFullData: Politikoz[] = Array.from({ length: 10000 }, (_, i) => generatePolitikoz(i));
  