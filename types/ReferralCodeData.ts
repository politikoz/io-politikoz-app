export interface ReferralCodeValidationResponse {
  valid?: boolean;
  isValid?: boolean; // Incluir ambos os nomes possíveis
  owner?: boolean;
  isOwner?: boolean; // Incluir ambos os nomes possíveis
}

// Tipo alternativo para quando a API retorna boolean direto
export type ReferralCodeValidationResult = boolean | ReferralCodeValidationResponse;