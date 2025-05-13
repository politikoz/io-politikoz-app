export interface Candidate {
  place: number;
  name: string;
  votes: number;
  user: boolean;
  winningPosition: boolean;
  positionsToWin: number;
  image: string;
}

export interface ElectionGroup {
  role: string;
  candidates: Candidate[][];
}

export interface UserCandidatesResponse {
  data: ElectionGroup[];
}