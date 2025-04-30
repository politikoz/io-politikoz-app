export type AutoLinkEntity = "politikoz" | "party" | "random";

export interface TicketDistribution {
  [ticketType: string]: number;
}

export interface AutoLinkConfigData {
  politikoz: {
    [key: string]: TicketDistribution; // Inclui tanto random quanto IDs específicos
  };
  user: null;
  party: {
    [key: string]: TicketDistribution;
  } | null;
}

export const INITIAL_CONFIG: AutoLinkConfigData = {
  politikoz: {},
  user: null,
  party: null
};
