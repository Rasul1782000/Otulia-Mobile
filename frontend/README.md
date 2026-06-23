<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ce2f5135-1138-4563-be88-432e649088b0

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Run on Android Emulator

This project can also be launched with Expo on an Android emulator.

1. Start the emulator manually if it is not already running:
   `C:\Users\Rasul\AppData\Local\Android\Sdk\emulator\emulator @Medium_Phone_API_36.1`
2. In the frontend folder, run:
   `npm run android`

If Expo reports that the emulator quit before opening, stop any stale emulator processes and restart adb:

```powershell
adb kill-server
adb start-server
emulator -avd Medium_Phone_API_36.1 -read-only
```
