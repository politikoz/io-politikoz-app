
// 🔹 Mock dos Tickets do Usuário
export const mockUserTickets: Record<string, number> = {
  FRONTMAN: 0,
  CORRUPT: 0,
  LOBBYIST: 0,
  LAUNDERER: 0,
  BRIBER: 0,
};

// 🔹 Tipos de Ticket Disponíveis
export const ticketTypes = Object.keys(mockUserTickets);

// 🔹 Mock da Afilição do Usuário a um Partido
export const userParty = {
  hasParty: true, // Define se o usuário pertence a um partido
  party: {
    id: "P02", // ID do partido
    sigla: "REP", // Sigla do partido
    name: "Republican Party", // Nome completo do partido
  },
};
