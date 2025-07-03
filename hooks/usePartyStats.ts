import { useQuery } from '@tanstack/react-query';
import { PartyStats } from '@/types/PartyStats';
import api from '@/app/lib/api';
import { useEffect, useState } from 'react';

const OTHERS_COLOR = '#808080';

export function usePartyStats() {
    const [stakeAddress, setStakeAddress] = useState<string | null>(null);
    
      useEffect(() => {
        setStakeAddress(localStorage.getItem('stakeAddress'));
      }, []);
  
    return useQuery({
      queryKey: ['partyStats', stakeAddress],
      queryFn: async () => {
        const response = await api.get<PartyStats[]>('/proxy/office/parties-stats');
        return response.data;
      },
      select: (data) => {
        // Filter out election_pot from main sorting and calculations
        const regularData = data.filter(stat => stat.party !== 'election_pot');
        const sortedData = [...regularData].sort((a, b) => b.percentage - a.percentage);
        const userStats = stakeAddress 
          ? regularData.find(stat => stat.stakeAddress === stakeAddress)
          : null;
  
        const top5 = sortedData.slice(0, 5);
        
        // Create legend data (includes all except election_pot)
        const legendData = top5.map(stat => ({
          name: stat.stakeAddress === stakeAddress ? 'You' : stat.party,
          percentage: stat.percentage,
          color: stat.stakeAddress === stakeAddress && stat.percentage === 0 ? '#CCCCCC' : stat.color,
          earningsEstimate: stat.earningsEstimate
        }));

        // Calculate others percentage including election_pot
        const othersPercentage = Number(
          (sortedData
            .filter(stat => !top5.find(t => t.stakeAddress === stat.stakeAddress))
            .reduce((sum, stat) => sum + stat.percentage, 0) +
           (data.find(stat => stat.party === 'election_pot')?.percentage || 0))
            .toFixed(2)
        );
  
        if (othersPercentage > 0) {
          const othersData = {
            name: 'Others',
            percentage: othersPercentage,
            color: OTHERS_COLOR,
            earningsEstimate: 0
          };
          legendData.push(othersData);
        }
        
        // Add zero-percentage user to legend if needed
        if (stakeAddress && !userStats) {
          legendData.push({
            name: 'You',
            percentage: 0,
            color: '#CCCCCC',
            earningsEstimate: 0
          });
        }
  
        return {
          players: legendData,
          graphPlayers: legendData.filter(player => player.percentage > 0),
          userEstimate: userStats?.earningsEstimate || 0
        };
      }
    });
}