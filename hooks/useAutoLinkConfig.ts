import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { AutoLinkAPIResponse, INITIAL_AUTOLINK_CONFIG } from '@/types/AutoLinkConfigData';
import { getDecryptedStakeAddress } from '@/utils/encryption';

export function useAutoLinkConfig() {
  const queryClient = useQueryClient();
  const mockStakeAddress = process.env.NEXT_PUBLIC_STAKE_ADDRESS_MOCK;
  const stakeAddress = mockStakeAddress || getDecryptedStakeAddress();

  const query = useQuery({
    queryKey: ['autoLinkConfig', stakeAddress],
    queryFn: async () => {
      if (!stakeAddress) throw new Error('No stake address found');
      
      const response = await api.get<AutoLinkAPIResponse>(
        `/api/v1/office/tickets/config?stakeAddress=${stakeAddress}`
      );
      return response.data;
    },
    initialData: INITIAL_AUTOLINK_CONFIG,
    staleTime: 0,
    gcTime: 60 * 2000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!stakeAddress
  });

  // Single mutation for both saving and deleting
  const updateConfigMutation = useMutation({
    mutationFn: async (updatedConfig: AutoLinkAPIResponse) => {
      console.log('Sending config to API:', {
        stakeAddress,
        config: updatedConfig
      });
      
      const response = await api.put('/api/v1/office/tickets/config', {
        stakeAddress,
        config: updatedConfig
      });
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['autoLinkConfig', stakeAddress] });
    }
  });

  const handleSave = async (newConfig: AutoLinkAPIResponse) => {
    try {
      return await updateConfigMutation.mutateAsync(newConfig);
    } catch (error) {
      console.error('Error saving config:', error);
      throw error;
    }
  };

  const handleDelete = async ({ entityType, entityId }: { entityType: 'party' | 'politikoz' | 'random', entityId: string }) => {
    const currentConfig = query.data;
    let updatedConfig = { ...currentConfig };

    if (entityType === 'politikoz') {
      const { [entityId]: removed, ...rest } = updatedConfig.politikoz;
      updatedConfig.politikoz = rest;
    } else if (entityType === 'party' && updatedConfig.party) {
      const { [entityId]: removed, ...rest } = updatedConfig.party;
      updatedConfig.party = rest;
    }

    return updateConfigMutation.mutateAsync(updatedConfig);
  };

  return {
    ...query,
    saveConfig: handleSave,
    deleteConfig: handleDelete,
    isSaving: updateConfigMutation.isPending,
    isDeleting: updateConfigMutation.isPending
  };
}