import { useEffect, useState } from 'react';
import { loadUserPreferences } from '../utils/storage';
import Timer from './Timer';
import { BlockedSite } from '../types';

const BlockedPage = () => {
  const [blockedSite, setBlockedSite] = useState<BlockedSite | null>(null);

  useEffect(() => {
    // Set body styles
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100vw';
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';

    const loadBlockedInfo = async () => {
      try {
        // Get the blocked site from the URL hash
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.replace('#blocked?', ''));
        const siteUrl = params.get('site');

        if (!siteUrl) return;

        // Load preferences to get the actual block info
        const preferences = await loadUserPreferences();
        const siteInfo = preferences.blockedSites.find(s => s.url === siteUrl);

        if (siteInfo && siteInfo.endTime > Date.now()) {
          setBlockedSite(siteInfo);
        } else {
          // If the block has expired, redirect back
          const url = new URL(siteUrl, window.location.origin);
          window.location.href = url.toString();
        }
      } catch (error) {
        console.error('Error loading blocked info:', error);
      }
    };

    loadBlockedInfo();
    // Set up an interval to check remaining time
    const interval = setInterval(loadBlockedInfo, 10000); // Check every 10 seconds

    // Cleanup function
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
      clearInterval(interval);
    };
  }, []);

  // Calculate remaining time in minutes
  const getRemainingTime = (): number => {
    if (!blockedSite) return 0;
    const remaining = Math.ceil((blockedSite.endTime - Date.now()) / (60 * 1000));
    return Math.max(0, remaining);
  };

  // Handle timer complete
  const handleTimerComplete = () => {
    const siteUrl = blockedSite?.url;
    if (siteUrl) {
      const url = new URL(siteUrl, window.location.origin);
      window.location.href = url.toString();
    }
  };

  if (!blockedSite) {
    return null;
  }

  const remainingTime = getRemainingTime();

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
      }}
    >
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8 text-center m-4">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Blocked</h1>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium">{blockedSite.url}</p>
        </div>

        <p className="text-gray-600 mb-6">
          This website is currently blocked to help you stay focused.
        </p>

        {remainingTime > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700 font-medium mb-2">Time Remaining</p>
            <Timer
              key={blockedSite.endTime} // Force timer to reset when endTime changes
              duration={remainingTime}
              onComplete={handleTimerComplete}
            />
          </div>
        )}

        <button
          onClick={() => window.close()}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors"
        >
          Close Tab
        </button>
      </div>
    </div>
  );
};

export default BlockedPage;
