import React from 'react';
import { BlockedSite } from '../types';

interface BlockedSitesListProps {
  sites: BlockedSite[];
  onRemove: (url: string) => void;
}

const BlockedSitesList: React.FC<BlockedSitesListProps> = ({ sites, onRemove }) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  if (sites.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-500">
        No websites are currently blocked
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Blocked Sites</h2>
      <div className="space-y-3">
        {sites.map((site) => (
          <div
            key={site.url}
            className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex-1">
              <div className="font-medium text-gray-900">{site.url}</div>
              <div className="text-sm text-gray-600">
                Blocked for {formatDuration(site.timeBlocked)}
              </div>
            </div>
            <button
              onClick={() => onRemove(site.url)}
              className="ml-4 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md px-3 py-1 text-sm font-medium transition-colors duration-200"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockedSitesList;
