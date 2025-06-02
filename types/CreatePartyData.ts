export interface CreatePartyRequest {
  acronym: string;
  name: string;
  flagColor: string;
  stakeAddress: string;
}

export interface PartyInfoDTO {
  id: number;
  acronym: string;
  name: string;
  flagColor: string;
  referralCode: string;
}