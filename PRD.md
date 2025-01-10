# Enhanced Product Requirements Document (PRD) for Chrome Extension: Website Blocker

## 1. Project Overview
This project aims to develop a Chrome extension using Vite and React that enables users to block distracting websites for a specified duration. The extension will feature an attractive user interface and provide visual feedback on the time saved from each blocked website, enhancing overall productivity.

## 2. Objectives
- **Website Blocking**: Allow users to add websites to a block list and set timers for blocking them.
- **Visual Feedback**: Present a clear UI that displays the total time saved for each blocked website.
- **MVP Focus**: Concentrate on essential features without unnecessary complexity.
- **User Engagement**: Encourage users to provide feedback for future improvements.

## 3. Key Features
- **User-Friendly Interface**: Simple design utilizing React and Tailwind CSS.
- **Blocking Mechanism**: Prevent access to specified websites based on user-defined time limits.
- **Time Tracking**: Record and display the total time spent on blocked websites versus saved time.
- **Notifications**: Alert users when their blocking period is about to end.
- **Customization Options**: Allow users to personalize their block list and timer durations.
- **Analytics Dashboard**: Show statistics on block effectiveness (time saved, websites blocked).

## 4. Technical Requirements
### Technology Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS.
- **Chrome APIs**: Use Chrome storage API for user settings and tab control.

## 5. Development Phases

### Phase 1: Define Objectives and Features
- Clearly outline the extension's purpose, key features, and intended user experience.
- Define user personas to tailor features to target audiences.

### Phase 2: Set Up Development Environment
- Install Node.js, npm, and Visual Studio Code.
- Familiarize yourself with HTML, CSS, and JavaScript basics.
- Install TypeScript globally: 
    ```bash
    npm install -g typescript
    ```

### Phase 3: Create Project Structure
- Establish a new directory for your extension files with subdirectories for scripts, styles, and assets.

### Phase 4: Configure Vite
- Initialize a new Vite project:
    ```bash
    npm create vite@latest my-chrome-extension -- --template react-ts
    ```
- Install necessary dependencies:
    ```bash
    npm install @crxjs/vite-plugin tailwindcss
    ```
- Update `vite.config.ts` to include the CRXJS plugin for Chrome extensions:
    ```javascript
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import { crx } from '@crxjs/vite-plugin';
    
    export default defineConfig({
        plugins: [react(), crx({ manifest })],
        build: {
            rollupOptions: {
                input: {
                    popup: 'src/popup.html',
                    background: 'src/background.js',
                },
            },
        },
    });
    ```

### Phase 5: Create Manifest File
- Develop `manifest.json` with the following structure:
    ```json
    {
      "manifest_version": 3,
      "name": "Website Blocker",
      "version": "1.0",
      "description": "Block distracting websites for a specified time.",
      "permissions": ["storage", "tabs"],
      "background": {
        "service_worker": "src/background.js"
      },
      "action": {
        "default_popup": "src/popup.html",
        "default_icon": {
          "16": "assets/icon16.png",
          "48": "assets/icon48.png",
          "128": "assets/icon128.png"
        }
      }
    }
    ```

### Phase 6: Develop User Interface
- Create `popup.html` which will serve as the entry point for the UI.
- Implement React components in `src` (e.g., `Popup.tsx`) to manage UI elements dynamically.
- Use Tailwind CSS for styling.

    ```javascript
    // Example of a simple Popup component in React
    import React from 'react';

    const Popup = () => {
        return (
            <div className="p-4">
                <h1 className="text-lg font-bold">Website Blocker</h1>
                {/* Add input fields and buttons here */}
            </div>
        );
    };

    export default Popup;
    ```

### Phase 7: Implement Core Functionality
- Write JavaScript code to handle blocking logic using Chrome APIs.
- Utilize storage APIs to save user preferences and manage the block list.
- Implement timer functionality to adhere to user-defined durations.
Certainly! To incorporate storage for saving user data in your Chrome Extension, we can utilize the Chrome Storage API. This allows you to store user preferences, such as the list of blocked websites and their respective blocking durations, so they persist even after the extension is closed or the browser is restarted.

Below is an enhanced section of the PRD, specifically focusing on how to use Chrome Storage in your extension, along with examples and a step-by-step guide.

#### 7.1 Use Chrome Storage API

1. **Storage Options**:
   - **`chrome.storage.sync`**: Stores data that can be synchronized across the user's Chrome browsers (recommended for user preferences).
   - **`chrome.storage.local`**: Stores data only on the user's local machine (useful for larger data that doesn’t need synchronization).

2. **Data Structure**:
   Define a data structure to keep user preferences. For example:
   ```javascript
   interface UserPreferences {
       blockedWebsites: {
           url: string;
           blockDuration: number; // in minutes
       }[];
   }
   ```

3. **Setting Up Storage**:
   When the user adds a website to the block list, save this data in Chrome Storage:

   ```javascript
   const saveUserPreferences = (preferences: UserPreferences) => {
       chrome.storage.sync.set({ userPreferences: preferences }, () => {
           console.log('User preferences saved');
       });
   };
   ```

4. **Retrieving Data**:
   Fetch the saved preferences when the extension is loaded or when the popup is opened:

   ```javascript
   const loadUserPreferences = (callback: (preferences: UserPreferences) => void) => {
       chrome.storage.sync.get(['userPreferences'], (result) => {
           callback(result.userPreferences || { blockedWebsites: [] });
       });
   };
   ```

5. **Example Component Using Storage**:
   Here’s an example React component that allows users to add a website to the block list:

   ```javascript
   import React, { useState, useEffect } from 'react';

   const Blocker = () => {
       const [url, setUrl] = useState('');
       const [duration, setDuration] = useState(0);
       const [blockedWebsites, setBlockedWebsites] = useState([]);

       useEffect(() => {
           loadUserPreferences((preferences) => {
               setBlockedWebsites(preferences.blockedWebsites);
           });
       }, []);

       const handleBlockWebsite = () => {
           const newPreference = {
               url,
               blockDuration: duration,
           };

           blockedWebsites.push(newPreference);
           saveUserPreferences({ blockedWebsites });
           setUrl('');
           setDuration(0);
       };

       return (
           <div>
               <h2>Block a Website</h2>
               <input
                   type="text"
                   value={url}
                   onChange={(e) => setUrl(e.target.value)}
                   placeholder="Enter website URL"
               />
               <input
                   type="number"
                   value={duration}
                   onChange={(e) => setDuration(Number(e.target.value))}
                   placeholder="Block Duration (minutes)"
               />
               <button onClick={handleBlockWebsite}>Block</button>

               <h3>Blocked Websites</h3>
               <ul>
                   {blockedWebsites.map((site, index) => (
                       <li key={index}>{site.url} - {site.blockDuration} min</li>
                   ))}
               </ul>
           </div>
       );
   };

   export default Blocker;
   ```

#### 7.2 Implementing Blocking Logic

1. **Blocking Websites**:
   Use the `chrome.tabs` API along with the stored user preferences to block access to the specified websites.

   ```javascript
   const blockWebsite = (url) => {
       chrome.tabs.query({}, (tabs) => {
           tabs.forEach((tab) => {
               if (tab.url.includes(url)) {
                   chrome.tabs.update(tab.id, { url: 'chrome://newtab/' }); // Redirect to the new tab
               }
           });
       });
   };
   ```

2. **Implement Timer Functionality**:
   Use `setTimeout` or `setInterval` to manage the blocking duration for each website.

3. **Setup Notifications**:
   Notify users when their blocking time is about to end. For example, using the `chrome.notifications` API.

   ```javascript
   const notifyUser = (url, timeLeft) => {
       chrome.notifications.create({
           type: 'basic',
           iconUrl: 'assets/icon48.png',
           title: 'Website Blocker',
           message: `Blocking of ${url} will end in ${timeLeft} minutes.`,
       });
   };
   ```

### Conclusion of Phase 7
Utilizing the Chrome Storage API for saving user data enhances the user experience by making the blocking preferences persistent and personalized. By implementing these features, you ensure users can easily manage their blocked websites, track their productivity, and engage more effectively with the extension.

--- 

This approach not only captures how to use storage effectively but also emphasizes the importance of a user-friendly interface and a seamless experience. Feel free to further modify or expand on these examples to fit your project needs!

### Phase 8: Testing and Debugging
- Load the extension in Chrome via `chrome://extensions/`.
- Test all functionalities thoroughly using Chrome DevTools.
- Perform unit tests on core functionalities and integration tests on user flows.
- Implement error logging for better debugging.

### Phase 9: User Experience Design
- Ensure the UI is intuitive and follows Chrome's design guidelines.
- Conduct usability tests with potential users to gather feedback and refine usability.

### Phase 10: Final Testing and Quality Assurance
- Conduct regression testing to ensure new changes do not disrupt existing functionality.
- Test the extension across different devices and screen resolutions.
- Create test cases for critical functionalities.

### Phase 11: Deployment Preparation
- Build the extension for production using:
    ```bash
    npm run build
    ```

### Phase 12: Publish to Chrome Web Store
- Create a developer account on the Chrome Web Store and submit your extension.
- Prepare promotional materials (screenshots, description) for the store listing.

### Phase 13: Post-Launch Maintenance
- Monitor user feedback and address issues as they arise.
- Plan for regular updates and improvements based on user input and technological advancements.

## Conclusion
This enhanced PRD provides a comprehensive roadmap for developing a Chrome extension that blocks distracting websites while offering visual feedback on productivity gains. By following these structured phases, you will ensure a successful project execution and create a product that truly resonates with users. Always keep in mind the importance of user feedback and continuous improvement in the development process.