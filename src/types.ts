export interface BlockedSite {
  url: string;
  timeBlocked: number; // in minutes
  startTime: number;
  endTime: number;
}

export interface UserPreferences {
  blockedSites: BlockedSite[];
  timeTracking: {
    [key: string]: {
      totalTimeBlocked: number;
      lastBlocked: number;
    };
  };
}
