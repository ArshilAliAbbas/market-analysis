<img src="/logo.png" />

# 🧠 Axiom Terminal — AI Trading Dashboard

Axiom Terminal is a **real-time AI-powered trading dashboard** built to help traders analyze markets, interpret news, and plan trades using intelligent automation.

Designed with a **Bloomberg Terminal–inspired interface**, it combines market data, AI insights, and risk tools into one unified platform.

---

## 🚀 Features

### 📊 Market Watch

* Real-time tracking of:

  * Indices (S&P 500, Nasdaq)
  * Forex (EUR/USD, GBP/USD)
  * Crypto (BTC, ETH)
* Powered by Finnhub API

---

### 🧠 AI Market Narrative

* Generates a **live overview of current market conditions**
* Summarizes macro trends, sentiment, and key drivers

---

### 📰 Intelligence Feed

* Aggregates financial news in real time
* AI analyzes each article and provides:

  * Summary
  * Sentiment (bullish / bearish / neutral)
  * Market impact
  * Affected assets
  * Trade bias

---

### 📅 Economic Calendar

* Tracks key macroeconomic events
* Helps anticipate volatility and trading opportunities

---

### ⚖️ Risk Manager

* Calculate:

  * Position size
  * Risk percentage
  * Stop loss / take profit levels
* Built for disciplined trading

---

### 📈 Trade Planning (WIP)

* AI-assisted trade setups
* Structured entry, exit, and reasoning

---

### 🔔 Smart Notifications (WIP)

* Priority-based alerts
* Inspired by mobile notification systems

---

## 🛠 Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Deployment:** Vercel
* **APIs:**

  * Finnhub (Market Data & Economic Calendar)
  * NewsAPI (Fallback News Source)
  * Workers AI / OpenAI (AI Analysis Layer)

---

## ⚙️ Architecture

* Full-stack Next.js app using **serverless API routes**
* Backend logic handled in `/app/api/*`
* AI processing handled via:

  * `/api/analyze-news`
  * `/api/market-narrative`
* Designed for **low-latency + scalable edge deployment**

---

## 🧪 Local Development

```bash
pnpm install
pnpm run dev
```

Open http://localhost:3000

---

## 🔐 Environment Variables

Create a `.env.local` file:

```env
FINNHUB_API_KEY=your_key
NEWS_API_KEY=your_key
OPENAI_API_KEY=your_key
CF_API_TOKEN=your_cloudflare_token
```

---

## 🌐 Deployment

Deployed using Vercel.

Make sure to configure environment variables in:
**Project Settings → Environment Variables**

---

## 🎯 Roadmap

* [ ] Dynamic market tabs (Equities / FX / Crypto)
* [ ] AI “Current Market Play” feature
* [ ] Advanced notification system
* [ ] Full dark institutional UI
* [ ] Premium AI tier (monetization)

---

## 💡 Vision

Axiom Terminal aims to become a **personal AI trading assistant** — delivering institutional-level insights in a simple, fast, and accessible interface.

---

## ⚠️ Disclaimer

This platform is for informational purposes only and does not constitute financial advice. Always do your own research before making trading decisions.

---

## 📬 Contact

For collaboration or feedback, reach out via GitHub.

---

⭐ If you find this project useful, consider starring the repo.
