# The Ultimate Guide: From Local App to YouTube Playables Live

Follow these steps precisely to get your Ashta Chamma game published on YouTube.

## Part 1: Prerequisites & Setup
1.  **Get the Zip**: I have generated a fresh `ashta-chamma-playable.zip` in your project folder. This is the file you will upload to YouTube.
2.  **Git Check**: I have committed your source code with a local git message "Final polish...". You can view history by typing `git log` in your terminal.

---

## Part 2: Create a YouTube Channel (Zero Knowledge Start)
If you already have a YouTube channel, skip to Part 3.

1.  Go to **[YouTube.com](https://www.youtube.com)**.
2.  **Sign In**: Click "Sign In" at the top right using your Google/Gmail account.
3.  **Profile Menu**: Click your profile icon (top right).
4.  **Create a Channel**: Select "Create a channel". 
    *   Set a name (e.g., "Madhu's Games") and a handle.
    *   Click "Create". You now have a channel!

---

## Part 3: Access YouTube Studio & Playables
YouTube Playables is the platform where games live.

1.  Click your **Profile Icon** again.
2.  Select **YouTube Studio**.
3.  **Find Playables**: In the left sidebar, look for "Content", then click the "Playables" tab. (Note: If you don't see it, your account might need to be verified or you may need to apply for the Playables Beta via [Google's Playables Interest Form](https://support.google.com/youtube/answer/14352528)).
4.  **Developer Portal**: Alternatively, many developers use the [YouTube Playables Ingestion Portal](https://developers.google.com/youtube/playables) directly.

---

## Part 4: Publishing the Game
1.  **Click "Create" or "Upload Playable"** in the Playables section.
2.  **Upload Zip**: Drag and drop `ashta-chamma-playable.zip` into the uploader.
3.  **Fill Details**:
    *   **Title**: అష్టా చమ్మా (Ashta Chamma)
    *   **Description**: A classic Indian board game of strategy and luck.
    *   **Category**: Board / Strategy.
    *   **Orientation**: **Portrait** (Must be portrait for mobile compatibility).
4.  **Thumbnail**: Upload a screenshot of your beautiful board.
5.  **Submit for Review**: YouTube will review the game for policy compliance. This usually takes a few days.

---

## Part 5: Debugging like a Pro (For You)
I have set up your folder so you can debug directly in VS Code.

1.  **Open Project**: Open this folder in VS Code.
2.  **Start Dev Server**: Run `npm run dev` in your terminal.
3.  **Set Breakpoints**: Open `src/hooks/useGameState.js` or `src/App.jsx` and click to the left of a line number to set a red dot (breakpoint).
4.  **Launch Debugger**:
    *   Press **F5** or go to the "Run and Debug" tab in VS Code.
    *   Select **"Debug Ashta Chamma (Chrome)"**.
    *   A new Chrome window will open. When you do something in the game that hits the red dot, the code will **pause**, allowing you to inspect variables!

---

## Alternative: Share with Friends NOW (Free & Fast)
If YouTube review is taking too long:
1.  Go to **[Netlify Drop](https://app.netlify.com/drop)**.
2.  Drag the `dist` folder from your project into their window.
3.  It will give you a **Live URL** instantly. Send that link to anyone to play!

**Congratulations! Your game is ready for the world.**
