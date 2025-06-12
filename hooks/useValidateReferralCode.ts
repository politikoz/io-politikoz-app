import { useMutation } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { ReferralCodeValidationResult } from '@/types/ReferralCodeData';

interface ValidateReferralCodeParams {
  referralCode: string;
  stakeAddress: string;
}

export function useValidateReferralCode() {
  return useMutation({
    mutationFn: async ({ referralCode, stakeAddress }: ValidateReferralCodeParams) => {
      try {
        const response = await api.get<ReferralCodeValidationResult>(
          `/api/v1/office/referral-code/validate?code=${referralCode}&stakeAddress=${stakeAddress}`
        );

        // Handle both boolean and object response
        const result = response.data;
        
        if (typeof result === 'boolean') {
          // API retornou apenas boolean, não temos informação sobre isOwner
          return {
            valid: result,
            isOwner: false // Valor padrão quando não temos essa informação
          };
        } else {
          // API retornou objeto com valid e owner
          return {
            valid: result.valid ?? result.isValid, // Verificar ambos os nomes
            isOwner: result.owner ?? result.isOwner ?? false // Verificar ambos os nomes
          };
        }
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to validate referral code');
      }
    }
  });
}