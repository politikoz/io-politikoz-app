import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReleaseFromJailDTO, ReleaseFromJailResponse } from '@/types/release';
import api from '@/app/lib/api';
import { useEffect, useState } from 'react';

export function useReleasePrisoner() {
  const queryClient = useQueryClient();
  const [stakeAddress, setStakeAddress] = useState<string | null>(null);
  
  useEffect(() => {
    setStakeAddress(localStorage.getItem('stakeAddress'));
  }, []);

  const releaseMutation = useMutation({
    mutationFn: async (dto: ReleaseFromJailDTO): Promise<ReleaseFromJailResponse> => {
      if (!stakeAddress) {
        throw new Error('No stake address found');
      }

      // Format asset names to remove '#' and ensure correct format
      const formattedAssetNames = dto.assetNames.map(name => 
        name.startsWith('#') ? name.substring(1) : name
      );

      const response = await api.put<ReleaseFromJailResponse>(
        '/party/politikoz-release-from-jail', 
        {
          stakeAddress,
          assetNames: formattedAssetNames
        }
      );
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['politikoz'] });
      queryClient.invalidateQueries({ queryKey: ['userCandidates'] });
    },
    onError: (error: any) => {
     
      throw new Error(error.response?.data?.message || 'Failed to release prisoner');
    }
  });

  const handleRelease = async (assetNames: string[]): Promise<ReleaseFromJailResponse> => {
    try {
      return await releaseMutation.mutateAsync({ assetNames });
    } catch (error: any) {
      throw error;
    }
  };

  return {
    releasePrisoner: handleRelease,
    isReleasing: releaseMutation.isPending,
    releaseError: releaseMutation.error,
    stakeAddress
  };
}