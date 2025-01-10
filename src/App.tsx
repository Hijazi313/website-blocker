import { useState, useEffect } from 'react';
import AddSiteForm from './components/AddSiteForm';
import BlockedSitesList from './components/BlockedSitesList';
import BlockedPage from './components/BlockedPage';
import Timer from './components/Timer';
import { BlockedSite, UserPreferences } from './types';
import { saveUserPreferences, loadUserPreferences } from './utils/storage';

// Function to normalize URL
const normalizeUrl = (url: string): string => {
  // Remove protocol and www if present
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '');
};

function App() {
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([]);
  const [timeTracking, setTimeTracking] = useState<UserPreferences['timeTracking']>({});
  const isBlockedPage = window.location.hash.startsWith('#blocked');

  useEffect(() => {
    const loadSites = async () => {
      try {
        const preferences = await loadUserPreferences();
        // Filter out expired blocks
        const currentSites = preferences.blockedSites.filter(site => site.endTime > Date.now());
        setBlockedSites(currentSites);
        setTimeTracking(preferences.timeTracking || {});
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };
    loadSites();

    // Refresh the list periodically to remove expired blocks
    const interval = setInterval(loadSites, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleAddSite = async (url: string, timeBlocked: number) => {
    const normalizedUrl = normalizeUrl(url);

    // Check if site is already blocked
    if (blockedSites.some(site => normalizeUrl(site.url) === normalizedUrl)) {
      console.log('Site is already blocked:', normalizedUrl);
      return;
    }

    const now = Date.now();
    const newSite: BlockedSite = {
      url: normalizedUrl,
      timeBlocked,
      startTime: now,
      endTime: now + timeBlocked * 60 * 1000, // Convert minutes to milliseconds
    };

    console.log('Adding new blocked site:', newSite);
    const updatedSites = [...blockedSites, newSite];
    setBlockedSites(updatedSites);

    try {
      await saveUserPreferences({
        blockedSites: updatedSites,
        timeTracking: {
          ...timeTracking,
          [normalizedUrl]: {
            totalTimeBlocked: timeTracking[normalizedUrl]?.totalTimeBlocked || 0,
            lastBlocked: now,
          },
        },
      });
      console.log('Successfully saved preferences');
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const handleRemoveSite = async (url: string) => {
    const normalizedUrl = normalizeUrl(url);
    console.log('Removing site:', normalizedUrl);
    const updatedSites = blockedSites.filter(site => normalizeUrl(site.url) !== normalizedUrl);
    setBlockedSites(updatedSites);

    try {
      const updatedTimeTracking = { ...timeTracking };
      const removedSite = blockedSites.find(site => normalizeUrl(site.url) === normalizedUrl);

      if (removedSite) {
        const timeSpentBlocked =
          Math.min(Date.now() - removedSite.startTime, removedSite.timeBlocked * 60 * 1000) /
          (60 * 1000); // Convert to minutes

        updatedTimeTracking[normalizedUrl] = {
          totalTimeBlocked:
            (updatedTimeTracking[normalizedUrl]?.totalTimeBlocked || 0) + timeSpentBlocked,
          lastBlocked: Date.now(),
        };
      }

      await saveUserPreferences({
        blockedSites: updatedSites,
        timeTracking: updatedTimeTracking,
      });
      setTimeTracking(updatedTimeTracking);
      console.log('Successfully removed site and updated time tracking');
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const handleTimerComplete = (url: string) => {
    console.log('Timer completed for:', url);
    handleRemoveSite(url);
  };

  if (isBlockedPage) {
    return <BlockedPage />;
  }

  return (
    <div className="min-w-[400px] p-6 bg-gray-50">
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Website Blocker</h1>
        <p className="text-gray-600">Block distracting websites and stay focused</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <AddSiteForm onAdd={handleAddSite} />
      </div>

      {blockedSites.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <BlockedSitesList sites={blockedSites} onRemove={handleRemoveSite} />
          <div className="mt-6 space-y-4">
            {blockedSites.map(site => (
              <div key={site.url} className="bg-gray-50 p-4 rounded-lg">
                <div className="font-medium text-gray-900 mb-2">{site.url}</div>
                <Timer
                  duration={site.timeBlocked}
                  onComplete={() => handleTimerComplete(site.url)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
