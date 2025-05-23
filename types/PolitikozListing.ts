export interface PolitikozListing {
  image: string;
  market: string;
  name: string;
  price: number;
  time: number;
}

export type PolitikozCargo = 
  | 'PRESIDENT'
  | 'SENATOR'
  | 'MINISTER'
  | 'GOVERNOR'
  | 'FEDERAL_DEPUTY'
  | 'STATE_DEPUTY'
  | 'MAYOR'
  | 'COUNCILOR';

export const cargoMapping: Record<string, PolitikozCargo> = {
  'President': 'PRESIDENT',
  'Senator': 'SENATOR',
  'Minister': 'MINISTER',
  'Governor': 'GOVERNOR',
  'Federal_deputy': 'FEDERAL_DEPUTY',
  'State_deputy': 'STATE_DEPUTY',
  'Mayor': 'MAYOR',
  'Councilor': 'COUNCILOR'
};