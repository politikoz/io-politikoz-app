export type TicketType = "BRIBER" | "CORRUPT" | "FRONTMAN" | "LAUNDERER" | "LOBBYIST";

export interface TicketDistribution {
  [ticketType: string]: number;
}

export interface AutoLinkAPIResponse {
  politikoz: {
    [key: string]: TicketDistribution; // This will handle both random and specific politikoz IDs
  };
  user: null;
  party: {
    [key: string]: TicketDistribution;
  } | null;
}

export const INITIAL_AUTOLINK_CONFIG: AutoLinkAPIResponse = {
  politikoz: {},
  user: null,
  party: null
};