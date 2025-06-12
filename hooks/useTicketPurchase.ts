import { useMutation } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { CreateTicketPurchaseDTO } from '@/types/TicketPurchase';

export function useTicketPurchase() {
  const createPurchaseMutation = useMutation({
    mutationFn: async (purchaseData: CreateTicketPurchaseDTO) => {
      try {
        await api.post('/api/v1/office/ticket-purchase', purchaseData);
        return { success: true };
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            'Failed to register ticket purchase';
        throw new Error(errorMessage);
      }
    }
  });

  return {
    createTicketPurchase: createPurchaseMutation.mutateAsync,
    isCreating: createPurchaseMutation.isPending,
    createError: createPurchaseMutation.error
  };
}