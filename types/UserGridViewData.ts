export interface GridPolitikoz {
  name: string;
  earnings: number;
  role: string;
  place: number;
  image: string;
}

export interface UserGridViewResponse {
  winning: GridPolitikoz[];
  outOfStamina: GridPolitikoz[];
  losing: GridPolitikoz[];
}