import { UserPreferences, BlockedSite } from '../types';

const defaultPreferences: UserPreferences = {
  blockedSites: [],
  timeTracking: {},
};

export const saveUserPreferences = (preferences: UserPreferences): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ userPreferences: preferences }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};

export const loadUserPreferences = (): Promise<UserPreferences> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['userPreferences'], result => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.userPreferences || defaultPreferences);
      }
    });
  });
};

export const addBlockedSite = async (site: BlockedSite): Promise<void> => {
  const preferences = await loadUserPreferences();
  preferences.blockedSites.push(site);
  await saveUserPreferences(preferences);
};

export const removeBlockedSite = async (url: string): Promise<void> => {
  const preferences = await loadUserPreferences();
  preferences.blockedSites = preferences.blockedSites.filter(site => site.url !== url);
  await saveUserPreferences(preferences);
};

export const updateTimeTracking = async (url: string, duration: number): Promise<void> => {
  const preferences = await loadUserPreferences();
  if (!preferences.timeTracking[url]) {
    preferences.timeTracking[url] = {
      totalTimeBlocked: 0,
      lastBlocked: 0,
    };
  }
  preferences.timeTracking[url].totalTimeBlocked += duration;
  preferences.timeTracking[url].lastBlocked = Date.now();
  await saveUserPreferences(preferences);
};
