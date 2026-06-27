import AsyncStorage from '@react-native-async-storage/async-storage';

import { Competition } from '../types/competition';

const COMPETITIONS_CACHE_KEY = 'competitions_cache';

export async function saveCompetitionsCache(competitions: Competition[]) {
  await AsyncStorage.setItem(
    COMPETITIONS_CACHE_KEY,
    JSON.stringify(competitions)
  );
}

export async function getCompetitionsCache(): Promise<Competition[]> {
  const cachedData = await AsyncStorage.getItem(COMPETITIONS_CACHE_KEY);

  if (!cachedData) {
    return [];
  }

  return JSON.parse(cachedData);
}