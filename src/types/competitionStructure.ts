export interface SectorOption {
  id: number;
  name: string;
}

export interface RoundOption {
  id: number;
  name: string;
  number: number;
  sectors: SectorOption[];
}

export interface CompetitionStructure {
  competitionId: number;
  competitionName: string;
  rounds: RoundOption[];
}