import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { AutoLinkAPIResponse, INITIAL_AUTOLINK_CONFIG } from '@/types/AutoLinkConfigData';
import { useAuth } from './useAuth';

export function useAutoLinkConfig() {
  const { getSession } = useAuth(); // Add getSession
  const queryClient = useQueryClient();
  const mockStakeAddress = process.env.NEXT_PUBLIC_STAKE_ADDRESS_MOCK;
  const stakeAddress = mockStakeAddress || localStorage.getItem('stakeAddress');

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

  const updateConfigMutation = useMutation({
    mutationFn: async (updatedConfig: AutoLinkAPIResponse) => {
      if (!stakeAddress) {
        throw new Error('No stake address found');
      }

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

  const deleteConfigMutation = useMutation({
    mutationFn: async ({ entityType, entityId }: { entityType: 'party' | 'politikoz' | 'random', entityId: string }) => {
      const session = getSession();
      if (!session?.jwt) {
        throw new Error('Authentication required');
      }

      const currentConfig = query.data;
      let updatedConfig = { ...currentConfig };

      // Add artificial delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (entityType === 'politikoz') {
        const { [entityId]: removed, ...rest } = updatedConfig.politikoz;
        updatedConfig.politikoz = rest;
      } else if (entityType === 'party' && updatedConfig.party) {
        const { [entityId]: removed, ...rest } = updatedConfig.party;
        updatedConfig.party = rest;
      }

      return updateConfigMutation.mutateAsync(updatedConfig);
    }
  });

  const handleSave = async (newConfig: AutoLinkAPIResponse) => {
    // Check session from cookie
    const session = getSession();
    if (!session?.jwt) {
      console.error('[useAutoLinkConfig] No valid session found in cookie');
      throw new Error('Authentication required');
    }
    
    try {
      console.log('[useAutoLinkConfig] Saving config with session:', !!session);
      return await updateConfigMutation.mutateAsync(newConfig);
    } catch (error: any) {
      console.error('[useAutoLinkConfig] Error saving config:', error);
      throw error;
    }
  };

  const handleDelete = async ({ entityType, entityId }: { entityType: 'party' | 'politikoz' | 'random', entityId: string }) => {
    const session = getSession();
    if (!session?.jwt) {
      console.error('[useAutoLinkConfig] No valid session found in cookie');
      throw new Error('Authentication required');
    }

    const currentConfig = query.data;
    let updatedConfig = { ...currentConfig };

    // Add artificial delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 1000));

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
    isDeleting: deleteConfigMutation.isPending,
    isAuthenticated: !!getSession()?.jwt // Update to use cookie session
  };
}