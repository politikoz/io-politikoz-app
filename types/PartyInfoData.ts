export interface PartyInfo {
  id: number;
  acronym: string;
  name: string;
  flagColor: string;
  referralCode: string;
}

export interface ReferralRanking {
  partyAcronym: string;  // Changed from referralCode
  count: number;
  position: number;
  isPartyReferral: boolean;
}

export interface PartyInfoResponse {
  party: PartyInfo | null;
  availableColors: string[];
  referralRanking: ReferralRanking[];
}

export const INITIAL_PARTY_INFO: PartyInfoResponse = {
  party: null,
  availableColors: [],
  referralRanking: []
};