import { useMutation } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { ReferralCodeValidationResult } from '@/types/ReferralCodeData';

export function useValidateReferralCode() {
  return useMutation({
    mutationFn: async (referralCode: string) => {
      try {
        const response = await api.get<ReferralCodeValidationResult>(
          `/api/v1/office/referral-code/validate?code=${referralCode}`
        );

        // Handle both boolean and object response
        const result = response.data;
        return {
          valid: typeof result === 'boolean' ? result : result.valid
        };
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to validate referral code');
      }
    }
  });
}