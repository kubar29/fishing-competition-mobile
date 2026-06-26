export type Start = {
  id: number;
  competitorId: number;
  roundId: number;
  sectorId: number;
  position: number;
  weight: number;
  status: string;
  penaltyPoints: number;
  sectorPoints: number | null;
  subSector: string | null;

  competitor: {
    id: number;
    name: string;
    surname: string;
    category: string;
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
    roundId: number;
  };
};