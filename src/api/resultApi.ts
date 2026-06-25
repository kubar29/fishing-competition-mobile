import { ClassificationResult } from '../types/result';
import { apiClient } from './apiClient';

export async function getClassificationResults(
  competitionId: string,
  roundId: number,
  sectorId: number
): Promise<ClassificationResult[]> {
  const response = await apiClient.get<ClassificationResult[]>(
    `/results/competition/${competitionId}/round/${roundId}/sector/${sectorId}`
  );

  return response.data;
}