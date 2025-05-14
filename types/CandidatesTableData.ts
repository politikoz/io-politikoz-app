export interface Candidate {
  name: string;
  role: string;
  place: number;
  earnings: number;
  stamina: number;
  winningPosition: boolean;
  outOfStamina: boolean;
  stakeAddress?: string;
  isUser: boolean;
}  

export interface CandidatesTableResponse {
  data: Candidate[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CandidatesTableFilters {
  page: number;
  pageSize: number;
  role: string;
  winning: boolean;
  outOfStamina: boolean;
  stakeAddress?: string;
}