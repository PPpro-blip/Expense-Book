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
- **Ledger & Table Tools:** 5-column responsive ledger with live cumulative running totals, date sorting, keyword search, category filtering, single-record editing, and deletion tombstones.
- **RFC4180 CSV Export:** Export clean expense reports formatted with UTF-8 BOM for Microsoft Excel, Google Sheets, and Numbers.
- **Indian Rupee (INR / ₹) Formatting:** Full localization with `en-IN` numbering (`₹1,23,456.00`).

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
├── sw.js                         # Service Worker for offline app-shell caching
├── README.md
└── vercel.json                   # Vercel deployment configuration
```
