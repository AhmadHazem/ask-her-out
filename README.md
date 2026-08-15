# Ask Her Out — Setup Guide

A little one-page site: she sees a Yes/No question (No runs away when hovered), Yes triggers a gif + confetti hearts, then she picks a date, a time, and an activity (coffee, dinner, movie, walk, etc. — or she can leave it to you) — and it emails you the result.

## 1. Add your photo and gif

- Put your image and gif files inside the `assets/` folder. Any name is fine, e.g. `assets/us.jpg` and `assets/celebrate.gif`.
- Open `index.html` and find these two placeholder blocks:

  **Photo (top of the question card):**
  ```html
  <div class="photo-slot" id="photo-slot">
    <span>place a photo here — see README</span>
  </div>
  ```
  Replace the inner `<span>` with an `<img>` tag:
  ```html
  <div class="photo-slot" id="photo-slot">
    <img src="assets/us.jpg" alt="">
  </div>
  ```

  **Gif (shown after she clicks Yes):**
  ```html
  <div class="gif-slot" id="gif-slot">
    <span>place a gif here — see README</span>
  </div>
  ```
  Replace with:
  ```html
  <div class="gif-slot" id="gif-slot">
    <img src="assets/celebrate.gif" alt="">
  </div>
  ```

That's it for images — no other code changes needed.

## 2. Set up email delivery (Formspree — free, no backend needed)

A static website can't send emails by itself, so this uses **Formspree**, a free form-relay service.

1. Go to https://formspree.io and sign up (free tier is enough — 50 submissions/month).
2. Click **"New Form"**, name it whatever you like.
3. Copy the endpoint it gives you, it looks like:
   `https://formspree.io/f/abcdEFGH`
4. Open `config.js` and paste it in:
   ```js
   formspreeEndpoint: "https://formspree.io/f/abcdEFGH",
   ```
5. Formspree will ask you to confirm your email address the first time a submission comes in — check your inbox after your first test send.

That's the whole email setup. When she hits **Send it**, the date/time/restaurant get emailed straight to you.

## 3. Customize the activity options

Instead of a paid Google Maps search, she picks from a set of activity cards you define (coffee, dinner, movie, walk, dessert, etc.), or taps "Surprise me — you pick."

Open `config.js` and edit the `activities` list:

```js
activities: [
  { icon: "☕", title: "Coffee & catch up", desc: "Something cozy, good coffee, better conversation." },
  { icon: "🍝", title: "Dinner out", desc: "Wherever has good food and no rush to leave." },
  { icon: "🎬", title: "Movie night", desc: "Something at the cinema — your pick." },
  // add, remove, or edit freely — icon is any emoji, title and desc are short text
],
```

No API keys, no billing, nothing to enable — it just works.

## 4. Test it locally before deploying

Open `index.html` directly in your browser (double-click it) and click through all the steps. The map and email send won't work fully from a local file — that's expected, test those after deploying (step 5).

## 5. Deploy it (pick one, both are free)

### Option A: Netlify Drop (easiest, 2 minutes, no account tinkering)
1. Go to https://app.netlify.com/drop
2. Drag your whole `askout` folder onto the page.
3. It instantly gives you a live URL like `https://random-name-123.netlify.app`.
4. (Optional) Click "Site settings" → "Change site name" to make the URL nicer, e.g. `https://willyougoout.netlify.app`.

### Option B: GitHub Pages (if you already use GitHub)
1. Create a new repository, e.g. `ask-her-out`.
2. Upload all files (`index.html`, `app.js`, `config.js`, `assets/` folder) to it.
3. Go to **Settings → Pages**.
4. Under "Build and deployment", set Source to `Deploy from a branch`, branch `main`, folder `/root`.
5. Save — after a minute your site is live at:
   `https://yourusername.github.io/ask-her-out/`

## 6. Send her the link

Once deployed, just text or message her the URL from step 5. That's it!

---

### Quick troubleshooting
- **"Send it" button says sending isn't configured** → you haven't added your Formspree endpoint in `config.js`.
- **Email never arrives** → check spam, and make sure you confirmed your email with Formspree after the first submission attempt.
- **Images don't show** → double check the file path matches exactly what's in `assets/` (case-sensitive on some hosts).
