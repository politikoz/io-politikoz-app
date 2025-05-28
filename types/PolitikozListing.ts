export const cargoMapping: Record<string, string> = {
  "President": "PRESIDENT",
  "Senator": "SENATOR",
  "Minister": "MINISTER",
  "Governor": "GOVERNOR",
  "Federal_deputy": "FEDERAL_DEPUTY",
  "State_deputy": "STATE_DEPUTY",
  "Mayor": "MAYOR",
  "Councilor": "COUNCILOR"
};

export interface PolitikozListing {
  image: string;
  market: string;
  name: string;
  price: number;
  time: number;
}