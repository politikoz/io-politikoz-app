/**
 * Resposta da API de verificação de número de entrada
 */
export interface VerificationResponseDTO {
  entryNumber: string;
  valid: boolean;  // Changed from isValid to valid to match API response
  proof: Array<{
    isLeft: boolean;
    hash: string;
  }>;
}

/**
 * Parâmetros para a verificação de número de entrada
 */
export interface VerificationParams {
  entryNumber: string;
  electionId: number;
}

/**
 * Resposta do hook de verificação
 */
export interface VerificationResult {
  data: VerificationResponseDTO | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  verify: (params: VerificationParams) => Promise<VerificationResponseDTO | null>;
}