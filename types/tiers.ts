export type TierStatus = 'PENDING' | 'WAIT' | 'COMPLETED';

export interface ElectionInfo {
    nextElectionEpoch: number;
    frontmanPrize: number;
    electionStartDate: string;
    nextPotentialElectionEpoch: number;
    nextPotentialElectionStartDate: string;
}

export interface Tier {
    id: number;
    tierId: number;
    kozSupply: number;
    remainingKozSupply: number;
    adaPerKoz: number;
    ticketsPerTier: number;
    adaPerTicket: number;
    prizePerTier: number;
    status: TierStatus;
}

export interface TiersDashboard {
    currentTier: Tier;
    allTiers: Tier[];
    electionInfo: ElectionInfo;
}