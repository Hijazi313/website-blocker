# Website Blocker Chrome Extension 🚫

A powerful Chrome extension built with React, TypeScript, and Vite that helps you stay focused by blocking distracting websites for specified durations.

![Website Blocker Demo](demo.gif)

## Features ✨

- 🎯 Block distracting websites with custom durations
- ⏱️ Set block duration in hours and minutes
- 🔄 Auto-refresh blocking rules every minute
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔗 Quick URL addition from current tab
- ⚡ Built with performance in mind
- 🛡️ Uses Chrome's declarativeNetRequest API for efficient blocking
- 🕒 Countdown timer for blocked sites
- 📱 Mobile-friendly popup interface

## Installation 🚀

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/website-blocker.git
   cd website-blocker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory from the project

## Development 🛠️

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Make your changes and see them live in Chrome
3. Build the production version:
   ```bash
   npm run build
   ```

## Tech Stack 💻

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Chrome APIs**: 
  - declarativeNetRequest
  - storage
  - tabs

## Project Structure 📁

```
website-blocker/
├── src/
│   ├── components/         # React components
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
│   ├── App.tsx            # Main app component
│   └── background.ts      # Service worker
├── public/                # Static assets
├── dist/                  # Built extension
└── manifest.json          # Extension manifest
```

## Usage 📝

1. Click the extension icon in Chrome
2. Enter a website URL or click the link icon to use current tab's URL
3. Set the block duration (hours and minutes)
4. Click "Block Website"
5. Try to visit the blocked site - you'll see a blocking page with:
   - The blocked website URL
   - Remaining time
   - Option to close the tab

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development Team 👥

- **Lead Developer**: Muhammad Hamza Asif
- **AI Assistant**: Cascade by Codeium
  - Implemented core blocking logic
  - Designed and developed UI components
  - Added real-time URL capture feature
  - Fixed bugs and improved performance
  - Provided technical guidance and best practices

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)

---

Made with ❤️ to help you stay focused and productive!
