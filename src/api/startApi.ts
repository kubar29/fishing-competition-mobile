import { Start } from '../types/start';
import { apiClient } from './apiClient';

type UpdateStartRequest = {
  weight: number;
  penaltyPoints: number;
};


export async function getStartsBySector(
  competitionId: number,
  roundId: number,
  sectorId: number
): Promise<Start[]> {
  const response = await apiClient.get<Start[]>(
    `/starts/competition/${competitionId}/round/${roundId}/sector/${sectorId}`
  );

  return response.data;
}


export async function getStartById(startId: string): Promise<Start> {
  const response = await apiClient.get<Start>(`/starts/${startId}`);
  return response.data;
}

export async function updateStart(
  startId: string,
  data: UpdateStartRequest
): Promise<Start> {
  const response = await apiClient.put<Start>(`/starts/${startId}`, data);
  return response.data;
}