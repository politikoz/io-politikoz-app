import { useQuery } from '@tanstack/react-query';
import { PartyStats } from '@/types/PartyStats';
import api from '@/app/lib/api';

const OTHERS_COLOR = '#808080';

export function usePartyStats() {
    const mockStakeAddress = process.env.NEXT_PUBLIC_STAKE_ADDRESS_MOCK;
    const stakeAddress = mockStakeAddress || localStorage.getItem('stakeAddress');
  
    return useQuery({
      queryKey: ['partyStats', stakeAddress],
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
        
        // Criar legendData primeiro (inclui todos)
        const legendData = top5.map(stat => ({
          name: stat.stakeAddress === stakeAddress ? 'You' : stat.party,
          percentage: stat.percentage,
          color: stat.stakeAddress === stakeAddress && stat.percentage === 0 ? '#CCCCCC' : stat.color,
          earningsEstimate: stat.earningsEstimate
        }));

        // Dados para o gráfico (apenas partidos com porcentagem > 0)
        const graphData = top5
          .filter(stat => stat.percentage > 0) // Remove entradas com porcentagem zero
          .map(stat => ({
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
          const othersData = {
            name: 'Others',
            percentage: othersPercentage,
            color: OTHERS_COLOR,
            earningsEstimate: 0
          };
          graphData.push(othersData);
          legendData.push(othersData);
        }
        
        // Adicionar usuário zerado apenas na legenda
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
          graphPlayers: graphData.filter(player => player.percentage > 0), // Garantir que não há zeros
          userEstimate: userStats?.earningsEstimate || 0
        };
      }
    });
}