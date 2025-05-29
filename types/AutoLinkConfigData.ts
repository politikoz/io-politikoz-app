export type TicketType = 
  | "BRIBER" 
  | "CORRUPT" 
  | "FRONTMAN" 
  | "FRONTMAN_BOOSTED_ELECTION_ONLY"
  | "LAUNDERER" 
  | "LOBBYIST";

export interface TicketDistribution {
  [ticketType: string]: number;
}

export interface AutoLinkAPIResponse {
  politikoz: {
    [key: string]: TicketDistribution;
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