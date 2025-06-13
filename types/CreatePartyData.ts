export interface CreatePartyRequest {
  acronym: string;
  name: string;
  flagColor: string;
  stakeAddress: string;
  partyType: string; // Mudança de PartyTypes para string
}

export interface PartyInfoDTO {
  id: number;
  acronym: string;
  name: string;
  flagColor: string;
  referralCode: string;
  partyType: string; // Mudança de PartyTypes para string
}