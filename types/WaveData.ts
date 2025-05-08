export interface WaveDetail {
  blockEpoch: number;
  blockHeight: number;
  blockTime: number;
  decreaseInStamina: number;
  minimumStamina: number;
  numberDrawnPrecision: number;
  numberFeePrecision: number;
  numbersToBeDraw: number;
  percentBonusTopRanking: number;
  baseVote: string;
  blockFee: string;
  blockOutput: string;
  electionWaveTurn: string;
}

export interface Wave {
  waveNumber: number;
  date: string;
  executedAt: string;
  nextWave: boolean;
  drawNumbers: string[];
  detail: WaveDetail;
}

export const INITIAL_WAVE_DATA: Wave[] = [];