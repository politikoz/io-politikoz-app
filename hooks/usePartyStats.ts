import { useQuery } from '@tanstack/react-query';
import { PartyStats } from '@/types/PartyStats';
import api from '@/app/lib/api';
import { getDecryptedStakeAddress } from '@/utils/encryption';

const OTHERS_COLOR = '#808080';

export function usePartyStats() {
    const mockStakeAddress = process.env.NEXT_PUBLIC_STAKE_ADDRESS_MOCK;
    const stakeAddress = mockStakeAddress || getDecryptedStakeAddress();
  
    return useQuery({
      queryKey: ['partyStats'],
      queryFn: async () => {
        const response = await api.get<PartyStats[]>('/api/v1/office/parties/stats');
        return response.data;
      },
      select: (data) => {
        const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);
        const userStats = stakeAddress 
          ? data.find(stat => stat.stakeAddress === stakeAddress)
          : null;
  
        const top5 = sortedData.slice(0, 5);
        if (userStats && !top5.find(stat => stat.stakeAddress === stakeAddress)) {
          top5.push(userStats);
        }
  
        const formattedData = top5.map(stat => ({
          name: stat.stakeAddress === stakeAddress ? 'You' : stat.party,
          percentage: stat.percentage,
          color: stat.color,
          earningsEstimate: stat.earningsEstimate
        }));
  
        const othersPercentage = Number(
          sortedData
            .filter(stat => !top5.find(t => t.stakeAddress === stat.stakeAddress))
            .reduce((sum, stat) => sum + stat.percentage, 0)
            .toFixed(2)
        );
  
        if (othersPercentage > 0) {
          formattedData.push({
            name: 'Others',
            percentage: othersPercentage,
            color: OTHERS_COLOR,
            earningsEstimate: 0
          });
        }
  
        return {
          players: formattedData,
          userEstimate: userStats?.earningsEstimate || 0
        };
      }
    });
  }