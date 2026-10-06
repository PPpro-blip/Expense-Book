# Expense Tracker Pro - Family & Household Finance

A feature-complete, Play Store-ready personal and family expense management Progressive Web App (PWA). Transform household and personal finance tracking with live interactive visual analytics (Chart.js), family-friendly expense categories, and 100% bug-free dual-layer instant storage persistence across all mobile and tablet lifecycle events.

## Highlights

- **Play Store-Ready PWA:** Installable on Android, iOS (iPhone/iPad), tablets, and desktop with standalone display mode, custom app icons, and offline service worker caching.
- **Interactive Visual Analytics (Chart.js):**
  - **Category Breakdown Donut / Pie Chart:** Live percentage and total expenditure breakdown per category with centered spend summaries and interactive category legend cards.
  - **Monthly Trends Bar Chart:** Month-by-month spending comparisons and transaction counts.
  - **Dynamic Real-Time Re-rendering:** Charts automatically update whenever expenses are added, edited, deleted, or filtered.
- **10 Family-Friendly Expense Categories:**
  - 🚗 **Travel**
  - ⛽ **Fuel**
  - 🍕 **Food & Dining**
  - 🏨 **Hotel & Stay**
  - 💼 **Company Related**
  - 🛒 **Groceries**
  - 🥦 **Fruits & Vegetables**
  - 👕 **Clothes & Apparel**
  - 💊 **Health & Healthcare**
  - 📦 **Other Expenses**
- **Ironclad Dual-Layer Instant Storage Engine (Mobile Fix):**
  - **Synchronous `localStorage` Writes:** Blocking writes execute the exact millisecond state changes, eliminating data loss when users swipe the app away or lock their screens.
  - **IndexedDB Backup:** Secondary persistent storage layer (`ExpenseTrackerDB_v3`) for multi-tier redundancy.
  - **Lifecycle Capture Listeners:** Automatically flushes pending state and form drafts on `visibilitychange`, `freeze`, `pagehide`, and `beforeunload` events using `{ capture: true }`.
  - **Form Draft Auto-Recovery:** Unsaved entry inputs are automatically preserved and restored.
- **Monthly Budget Goal & Live Progress Bar:**
  - Set a monthly spending limit (e.g. ₹25,000) from the Settings menu, with one-tap presets.
  - Dashboard progress bar shows spend vs. target, percentage used, and amount remaining.
  - Automatic colour thresholds: **Teal** (< 75%), **Amber** (75%–90%), **Red** (> 90% or exceeded, with overspend amount).
- **Instant Search & Date Range Filters:**
  - Real-time keyword search across descriptions, categories, and dates with a one-tap clear button.
  - Quick range toggles: **All Time**, **This Month**, **Last Month** — combinable with the category filter.
- **Settings Menu & Data Controls:** Set/update the monthly budget, export a full JSON backup, import/restore a JSON backup (duplicate-safe merge), export CSV, and clear all data behind a **double confirmation** (warning dialog + typing `DELETE`).
- **Native Mobile UX Polish:** Haptic feedback on taps and key actions, pull-to-refresh gesture with animated spinner, staggered row entrance animations, animated progress bar, and Escape/backdrop dismissal for every modal.
- **100% Offline Service Worker:** App shell, icons, and all CDN dependencies (Tailwind, Lucide, Chart.js, Google Fonts) are pre-cached — navigations fall back to the cached shell, same-origin assets are cache-first, and CDN assets use stale-while-revalidate.
- **Ledger & Table Tools:** 5-column responsive ledger with live cumulative running totals, date sorting, keyword search, category filtering, single-record editing, and deletion tombstones.
- **RFC4180 CSV Export:** Export clean expense reports formatted with UTF-8 BOM for Microsoft Excel, Google Sheets, and Numbers.
- **Indian Rupee (INR / ₹) Formatting:** Full localization with `en-IN` numbering (`₹1,23,456.00`).

---

## Monthly Budget Thresholds

| Usage of monthly budget | Progress bar colour | Status message |
| --- | --- | --- |
| Below 75% | Teal | On track — spending is healthy this month |
| 75% – 90% | Amber | Caution — over 75% of your budget used |
| Above 90% | Red | Critical — over 90% used |
| 100% or more | Red | Budget exceeded by ₹X |

---

## Storage Architecture

```text
User Action / State Mutation
  │
  ├── 1. [Synchronous] LocalStorage Master Key (0ms write, blocks OS force-quit loss)
  │
  ├── 2. [Asynchronous] IndexedDB Redundant Store (ExpenseTrackerDB_v3)
  │
  └── 3. [Lifecycle Hooks] Flush active draft & sync on visibilitychange / freeze / pagehide
```

---

## Run Locally

This is a dependency-free static web application. Run the development server with Python:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080` in your web browser.

---

## Project Structure

```text
.
├── assets/
│   ├── master-asset.svg          # Master brand mark
│   ├── master-asset.png          # Master export
│   ├── master-asset-maskable.svg # Maskable app icon vector
│   ├── icon-192.png              # PWA 192x192 icon
│   ├── icon-512.png              # PWA 512x512 icon
│   ├── icon-maskable-192.png     # Android adaptive icon
│   ├── icon-maskable-512.png     # Android adaptive icon
│   └── apple-touch-icon.png      # iOS home-screen icon
├── index.html                    # Single-page application, Chart.js analytics & storage engine
├── manifest.json                 # Web App Manifest for PWA installation
├── sw.js                         # Service Worker: offline app shell + CDN caching strategies
├── README.md
└── vercel.json                   # Vercel deployment configuration
```
