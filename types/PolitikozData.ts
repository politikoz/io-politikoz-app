export interface Politikoz {
  type: string;
  name: string;
  historic: string[] | null;
  stamina: number;
  dirtyMoney: number;
  influence: number;
  cleanMoney: number;
  bribePower: number;
  scapegoats: number;
  luckyNumber: string;
  prisonEpochs: number;
  releaseCost: number;
  imprisoned: boolean;
  releaseDate: string; // Add this new field
}
