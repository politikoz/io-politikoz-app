export interface PartyInfo {
  id: number;
  acronym: string;
  name: string;
  flagColor: string;
  referralCode: string;
  partyType: string; // Mudança de PartyTypes para string
}

export interface ReferralRanking {
  partyAcronym: string;
  kozAmount: number;
  position: number;
  isPartyReferral: boolean;
}

export interface PartyInfoResponse {
  party: PartyInfo | null;
  availableColors: string[];
  availablePartyTypes: string[]; // Mudança de PartyTypes[] para string[]
  referralRanking: ReferralRanking[];
}

export const INITIAL_PARTY_INFO: PartyInfoResponse = {
  party: null,
  availableColors: [],
  availablePartyTypes: [],
  referralRanking: []
};