import React, { useState } from 'react';

interface AddSiteFormProps {
  onAdd: (url: string, minutes: number) => void;
}

const AddSiteForm: React.FC<AddSiteFormProps> = ({ onAdd }) => {
  const [url, setUrl] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      const totalMinutes = hours * 60 + minutes;
      onAdd(url.trim(), totalMinutes);
      setUrl('');
      setHours(0);
      setMinutes(3);
    }
  };

  const getCurrentTabUrl = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.url) {
        // Extract hostname from URL
        const hostname = new URL(tab.url).hostname.replace(/^www\./, '');
        setUrl(hostname);
      }
    } catch (error) {
      console.error('Error getting current tab:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white rounded-lg p-6 shadow-sm border border-gray-200"
    >
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            Website URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="e.g., facebook.com"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
            <button
              type="button"
              onClick={getCurrentTabUrl}
              className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              title="Use current tab URL"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
            Hours
          </label>
          <input
            type="number"
            id="hours"
            value={hours}
            onChange={e => setHours(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-1">
            Minutes
          </label>
          <input
            type="number"
            id="minutes"
            value={minutes}
            onChange={e => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            min="0"
            max="59"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
      >
        Block Website
      </button>
    </form>
  );
};

export default AddSiteForm;
