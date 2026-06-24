import { Competition } from '../types/competition';
import { apiClient } from './apiClient';

export async function getCompetitions(): Promise<Competition[]> {
  const response = await apiClient.get<Competition[]>('/competitions');
  return response.data;
}
export async function getCompetitionById(id: string): Promise<Competition> {
  const response = await apiClient.get<Competition>(`/competitions/${id}`);
  return response.data;
}