export interface ReferralCodeValidationResponse {
  valid: boolean;
}

// Tipo alternativo para quando a API retorna boolean direto
export type ReferralCodeValidationResult = boolean | ReferralCodeValidationResponse;