export interface GovernanceData {
  votingPower: {
    total: number;
    used: number;
  };
  potShare: {
    percentage: number;
    treasuryBalance: number;
    totalAdaPerElection: number;
  };
  politikozElected: Record<string, number>;
  ticketElected: Record<string, number>;
  ticketLimits: {
    [key: string]: {
      min: number;
      max: number;
      current: number;
    };
  };
  distribution: Record<string, number>;
  ticketBoost: Record<string, number>;
  other: {
    electionEveryXEpochs: number;
    bestDayOfTheWeek: string;
    luckNumberPrecision: number;
    jailNumberPrecisionPercent: number;
    bailPerEpochInKoz: number;
    nextRebalanceEpoch: number;
  };
  waves: {
    [key: string]: {
      numbersToBeDrawn: number;
      numbersDrawnPrecision: number;
      numberFeePrecision: number;
      percentBonusTopRanking: number;
      decreaseInStamina: number;
      minimumStamina: number;
      waitInMinutesBeforeExecute: number;
    };
  };
}

// Estado inicial
export const INITIAL_GOVERNANCE_DATA: GovernanceData = {
  votingPower: {
    total: 0,
    used: 0
  },
  potShare: {
    percentage: 0.03,
    treasuryBalance: 0,
    totalAdaPerElection: 0
  },
  politikozElected: {
    PRESIDENT: 0,
    SENATOR: 0,
    MINISTER: 0,
    GOVERNOR: 0,
    FEDERAL_DEPUTY: 0,
    STATE_DEPUTY: 0,
    MAYOR: 0,
    COUNCILOR: 0
  },
  ticketElected: {
    CORRUPT: 0,
    LOBBYIST: 0,
    BRIBER: 0,
    LAUNDERER: 0,
    FRONTMAN: 0
  },
  ticketLimits: {
    CORRUPT: { min: 6000, max: 100000, current: 0 },
    LOBBYIST: { min: 3000, max: 50000, current: 0 },
    BRIBER: { min: 300, max: 5000, current: 0 },
    LAUNDERER: { min: 100, max: 500, current: 0 }
  },
  distribution: {
    PRESIDENT: 0,
    SENATOR: 0,
    MINISTER: 0,
    GOVERNOR: 0,
    FEDERAL_DEPUTY: 0,
    STATE_DEPUTY: 0,
    MAYOR: 0,
    COUNCILOR: 0,
    CORRUPT: 0,
    LOBBYIST: 0,
    BRIBER: 0,
    LAUNDERER: 0,
    FRONTMAN: 0
  },
  ticketBoost: {
    CORRUPT: 0,
    LOBBYIST: 0,
    BRIBER: 0,
    LAUNDERER: 0,
    FRONTMAN: 0
  },
  other: {
    electionEveryXEpochs: 1,
    bestDayOfTheWeek: "SATURDAY",
    luckNumberPrecision: 2,
    jailNumberPrecisionPercent: 2,
    bailPerEpochInKoz: 100,
    nextRebalanceEpoch: 0
  },
  waves: {
    "WAVE#1": {
      numbersToBeDrawn: 4,
      numbersDrawnPrecision: 2,
      numberFeePrecision: 2,
      percentBonusTopRanking: 0.1,
      decreaseInStamina: 10,
      minimumStamina: 61,
      waitInMinutesBeforeExecute: 60
    }
  }
};