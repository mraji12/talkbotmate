# Talkmate Bot

A small React chatbot interface built with Vite.

## Features
- Chat-style conversation UI
- API request support for Google Gemini models
- Keyboard shortcut: Ctrl+Enter / ⌘+Enter to send
- Responsive layout for desktop and mobile

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example env file:
   ```bash
   copy .env.example .env
   ```
3. Open `.env` and set your API key:
   ```ini
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Notes
- This app currently calls the Gemini API directly from the browser, so do not expose a production API key in a public deployment.
- For production, use a server-side proxy or backend to keep the key secret.

## Build
```bash
npm run build
```
