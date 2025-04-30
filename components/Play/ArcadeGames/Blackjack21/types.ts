export interface GameResult {
    block: number;
    time: string;
    playerCards: number[];
    dealerCards: number[];
    playerTotal: number;
    dealerTotal: number;
    outcome: string;
    drawnNumbers: number[];
  }
  