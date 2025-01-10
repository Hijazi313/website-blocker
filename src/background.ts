import { loadUserPreferences, saveUserPreferences } from './utils/storage';
import { BlockedSite } from './types';

console.log('Background script loaded!');

let currentRuleId = 1;

// Function to normalize URL
const normalizeUrl = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch (error) {
    return url.replace(/^www\./, '').replace(/^https?:\/\//, '');
  }
};

// Function to create a rule for blocking
const createBlockRule = (site: BlockedSite, ruleId: number): chrome.declarativeNetRequest.Rule => {
  const domain = normalizeUrl(site.url);
  const timeLeft = Math.ceil((site.endTime - Date.now()) / (60 * 1000));
  const blockPageUrl = chrome.runtime.getURL('index.html') + 
    `#blocked?site=${encodeURIComponent(site.url)}&timeLeft=${timeLeft}`;

  return {
    id: ruleId,
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
      redirect: {
        url: blockPageUrl
      }
    },
    condition: {
      urlFilter: `||${domain}/*`,
      resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME]
    }
  };
};

// Function to update blocking rules
const updateBlockingRules = async (): Promise<void> => {
  try {
    const preferences = await loadUserPreferences();
    const now = Date.now();
    
    // Filter out expired blocks
    const activeBlocks: BlockedSite[] = preferences.blockedSites.filter(site => site.endTime > now);
    
    // Remove all existing rules
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Array.from({ length: currentRuleId }, (_, i) => i + 1)
    });
    
    // Add new rules for active blocks
    const rules: chrome.declarativeNetRequest.Rule[] = activeBlocks.map((site, index) => {
      return createBlockRule(site, index + 1);
    });
    
    if (rules.length > 0) {
      currentRuleId = rules.length;
      await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules
      });
      console.log('Updated blocking rules:', rules);
    }
    
    // Update storage if we removed any expired blocks
    if (activeBlocks.length !== preferences.blockedSites.length) {
      await saveUserPreferences({
        ...preferences,
        blockedSites: activeBlocks
      });
      console.log('Cleaned up expired blocks');
    }
  } catch (error) {
    console.error('Error updating blocking rules:', error);
  }
};

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed/updated');
  try {
    await saveUserPreferences({
      blockedSites: [],
      timeTracking: {}
    });
    await updateBlockingRules();
    console.log('Storage initialized');
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes: { [key: string]: chrome.storage.StorageChange }) => {
  if ('userPreferences' in changes) {
    console.log('User preferences changed, updating rules');
    updateBlockingRules();
  }
});

// Update rules periodically to handle expired blocks
setInterval(updateBlockingRules, 60000); // Check every minute
