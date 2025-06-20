export interface ElectionMerkleDTO {
  electionId: number;
  entryNumbersMerkleRoot: string;
  txHashMerkle: string;
  electionStartDate: string;
}

export interface ElectionMerkleResponse {
  elections: ElectionMerkleDTO[] | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}