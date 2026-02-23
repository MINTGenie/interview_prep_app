# Interview Prep App

AI-powered interview preparation. Paste any job description + resume, pick an LLM, and get a personalised prep pack: skills bridges, STAR stories, a visual concept map, and mock interview questions. Sessions save in your browser.

## Quick Start

1. **Clone or download** this repo
2. **Open** `interview-prep-app.html` directly in Chrome or Firefox — no server needed
3. Click **⚙ Settings** → choose a provider → paste your API key → Save
4. Paste a job description + your resume → **Analyze Role** → answer clarifying questions → **Generate Prep**

## LLM Providers

| Provider | API Key | Notes |
|---|---|---|
| **Gemini** | Yes | Free tier (15 req/min). Recommended for getting started. |
| OpenAI | Yes | Paid. `gpt-4o-mini` is cheapest (~$0.01/session). |
| Mistral | Yes | Paid. Fast. |
| Ollama | No | Local. Run `ollama serve` first. |
| Claude | Yes | Needs `proxy.js` running (see below). |
| LM Studio | No | Local. Start the LM Studio server, paste the API Model Identifier. |

## Persist Your API Key (optional)

Copy `config.js.example` → `config.js`, fill in your key, and place it next to `interview-prep-app.html`:

```js
window.PREP_CONFIG = {
  provider: 'gemini',
  apiKey:   'YOUR_KEY_HERE',
  model:    'gemini-2.0-flash',
};
```

The app loads it automatically on startup — no need to re-enter the key in Settings.

> ⚠️ `config.js` is in `.gitignore` — never commit it.

## Claude Provider

The Anthropic API blocks direct browser requests. Run the included CORS proxy (no npm install needed):

```bash
node proxy.js
```

Then set provider to **Claude** in Settings. The proxy listens on `localhost:3001`.

## Rebuild from Source

The HTML is assembled from 7 part files (`p1_head_css.txt` → `p7_js_finish.txt`). To edit and rebuild:

```bash
python build_app.py
```

Output: `interview-prep-app.html` (~122 KB, fully self-contained single file).
