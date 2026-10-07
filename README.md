# Expense Tracker Pro - Family & Household Finance

A feature-complete, Play Store-ready personal and family expense management Progressive Web App (PWA). Transform household and personal finance tracking with live interactive visual analytics (Chart.js), family-friendly expense categories, real Google Sign-In with a private expense log per account, and 100% bug-free dual-layer instant storage persistence across all mobile and tablet lifecycle events.

## Highlights

- **Real Google Sign-In (Firebase Authentication via CDN):**
  - One-tap **Sign in with Google** from the header or Settings, using the Firebase compat SDKs loaded straight from the CDN — no build step.
  - Shows the signed-in user's **profile avatar and name** in the header; the Account sheet shows the full name, e-mail, **Switch account** (Google account chooser) and **Sign out**.
  - Sessions persist across launches (also offline), popup sign-in with automatic redirect fallback, friendly messages for every auth error.
- **User-Specific Expense Logs:** every Google account gets its **own** expense log, monthly budget and form draft on the device; signing out returns to the **Guest log**. On first sign-in the app offers to move existing Guest data into the account (or keep it separate).

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
- **100% Offline Service Worker:** App shell, icons, and all CDN dependencies (Tailwind, Lucide, Chart.js, Google Fonts, Firebase SDK) are pre-cached — navigations fall back to the cached shell, same-origin assets are cache-first, and CDN assets use stale-while-revalidate. A signed-in session is restored offline from local persistence.
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

## Google Sign-In & Per-Account Logs

Authentication uses the **Firebase JS SDK (compat builds) from the CDN**, loaded in `<head>`:

```html
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
```

The project's web config lives in `index.html` (`firebaseConfig`, project `expense-book-f199a`). It is the public client config — not a secret — access is governed by the Firebase Authentication settings below.

### One-time Firebase Console setup

1. **Enable the provider:** Firebase Console → *Authentication* → *Sign-in method* → **Google** → Enable (set a support e-mail) → Save.
2. **Authorize your domains:** *Authentication* → *Settings* → *Authorized domains* → add every host that serves the app (e.g. `your-app.vercel.app` and any custom domain). `localhost` is already authorized for development. Without this step sign-in fails with `auth/unauthorized-domain` — the app shows the exact host to add.
3. *(Recommended)* In Google Cloud Console → *APIs & Services* → *Credentials*, restrict the browser API key to your HTTP referrers.

### How sign-in works

| Situation | Flow |
| --- | --- |
| Desktop / mobile browsers, Android installed PWA | `signInWithPopup` with Google's account chooser (`prompt=select_account`) |
| Popup blocked / unsupported environment | Automatic fallback to `signInWithRedirect`; the result is picked up on reload |
| iOS home-screen (standalone) app | Redirect flow is used directly, because popups cannot complete there |
| SDK unavailable (offline first load, blocked) | App runs in **Guest mode**; the sign-in button explains why |

> **iOS home-screen note:** Safari 16.1+, Firefox 109+ and Chrome with third-party cookies blocked partition third-party storage, which can make the *redirect* flow come back signed-out while `authDomain` is `*.firebaseapp.com`. Popup sign-in (used in Safari and every other browser tab) is unaffected. To make sign-in fully reliable inside the iOS home-screen app, follow Firebase's [redirect best practices](https://firebase.google.com/docs/auth/web/redirect-best-practices): serve `/__/auth/*` from your own domain (a Vercel rewrite to `https://expense-book-f199a.firebaseapp.com/__/auth/:path*`), set `authDomain` to that domain, and add `https://<your-domain>/__/auth/handler` to the OAuth client's authorized redirect URIs.

### Account-scoped storage

Every account owns a separate namespace on the device; the Guest log keeps the original keys, so data from earlier versions is untouched.

| Data | Guest (signed out) | Signed-in Google account |
| --- | --- | --- |
| Expenses | `expense_tracker_master_data_v3` | `expense_tracker_master_data_v3__u_<uid>` |
| Monthly budget | `expense_tracker_monthly_budget_v1` | `expense_tracker_monthly_budget_v1__u_<uid>` |
| Draft / tombstones | `expense_tracker_draft_v3`, `expense_tracker_tombstones_v3` | same keys with `__u_<uid>` |
| IndexedDB mirror | `ExpenseTrackerDB_v3` | `ExpenseTrackerDB_v3__u_<uid>` |

- Switching accounts flushes the outgoing log, locks persistence, swaps the namespace and loads the incoming log — switches are queued and every async IndexedDB operation is scope-guarded, so logs can never bleed into each other.
- **First sign-in on a device with Guest data:** a one-time prompt offers **Move to my account** (expenses + budget move, Guest log is emptied) or **Keep separate**. The move is also available later from the Account sheet.
- Signing out never deletes anything: the account's log stays on the device and reappears on the next sign-in. JSON backups are tagged with the account they were exported from.

---

## Storage Architecture

```text
User Action / State Mutation            (active scope = Guest  or  Google uid)
  │
  ├── 1. [Synchronous] LocalStorage Master Key (0ms write, blocks OS force-quit loss)
  │
  ├── 2. [Asynchronous] IndexedDB Redundant Store (ExpenseTrackerDB_v3[__u_<uid>])
  │
  └── 3. [Lifecycle Hooks] Flush active draft & sync on visibilitychange / freeze / pagehide
```

---

## Run Locally

This is a dependency-free static web application. Run the development server with Python:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080` in your web browser. Google Sign-In works on `localhost` out of the box (it is an authorized domain by default); other hosts must be added in the Firebase Console as described above.

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
├── index.html                    # Single-page application, Google Sign-In, Chart.js analytics & storage engine
├── manifest.json                 # Web App Manifest for PWA installation
├── sw.js                         # Service Worker: offline app shell + CDN caching strategies
├── README.md
└── vercel.json                   # Vercel deployment configuration
```
