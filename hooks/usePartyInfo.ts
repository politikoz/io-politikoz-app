import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { PartyInfoResponse, INITIAL_PARTY_INFO } from '@/types/PartyInfoData';
import { useState, useEffect } from 'react';

export function usePartyInfo() {
  const [stakeAddress, setStakeAddress] = useState<string | null>(null);

  useEffect(() => {
    setStakeAddress(localStorage.getItem('stakeAddress'));
  }, []);

  const query = useQuery({
    queryKey: ['partyInfo', stakeAddress],
    queryFn: async () => {
      if (!stakeAddress) return INITIAL_PARTY_INFO;
      
      const response = await api.get<PartyInfoResponse>(
        `/api/v1/party/party-info?stakeAddress=${stakeAddress}`
      );
      return response.data;
    },
    enabled: !!stakeAddress
  });

  // If not connected, return definitive state
  if (!stakeAddress) {
    return {
      party: null,
      availableColors: [],
      availablePartyTypes: [],
      referralRanking: [],
      isWalletConnected: false,
      isPending: false
    };
  }

  // If connected, return loading state while fetching
  return {
    party: query.isLoading ? undefined : query.data?.party ?? null,
    availableColors: query.data?.availableColors ?? [],
    availablePartyTypes: query.data?.availablePartyTypes ?? [],
    referralRanking: query.data?.referralRanking ?? [],
    isWalletConnected: true,
    isPending: query.isLoading
  };
}