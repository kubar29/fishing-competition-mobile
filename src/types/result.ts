export interface ClassificationResult {
  id: number;
  startId: number;
  placeInSector: number;
  sectorPoints: number;
  finalPoints: number;
  status: 'PENDING' | 'CONFIRMED' | 'DISQUALIFIED';
  notes: string | null;
  start: {
    id: number;
    weight: number;
    penaltyPoints: number;
    status: 'ACTIVE' | 'DNS' | 'DNF' | 'DSQ';
    competitor: {
      id: number;
      name: string;
      surname: string;
      category: 'SENIOR' | 'WOMAN' | 'U25';
    };
    round: {
      id: number;
      name: string;
      number: number;
      competitionId: number;
    };
    sector: {
      id: number;
      name: string;
    };
  };
}