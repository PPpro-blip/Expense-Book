# Expense Tracker Pro

A polished, mobile-first expense tracker that works entirely in the browser. It is designed as a lightweight, app-like single page for quickly recording everyday expenses.

## Features

- Add dated expenses in the five required categories: **Travel**, **Fuel**, **Food**, **Hotel**, and **Company Related**
- Optional description for every entry
- Four-column expense history: **Date**, **Expenses (Category)**, **Price**, and cumulative **Sum**
- Grand total, entry count, current-month total, and top-category insights
- Filter records by category, including a filtered total
- Delete an individual record or clear all records (both use a confirmation dialog)
- Export the current list/filter as a UTF-8 CSV file
- Responsive, touch-friendly Play Store-inspired UI
- Private browser persistence through `localStorage` — no account or server required

## Run locally

This is a dependency-free static web app. Open `index.html` directly in a browser, or serve the directory with any static server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Data and privacy

Expense records are stored only in the current browser under the local storage key `expense-tracker-pro-expenses-v1`. Clearing browser site data will remove them. Use **Export CSV** for a portable backup.

## Deploy to Vercel

The included `vercel.json` configures this repository as a static Vercel deployment.

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the GitHub repository.
3. Leave the framework preset as **Other** and the build command blank.
4. Click **Deploy**.

Alternatively, with the Vercel CLI installed and authenticated:

```bash
vercel --prod
```

No environment variables or build step are required.

## Project files

```text
.
├── index.html     # Entire single-page application
├── README.md      # Project documentation
└── vercel.json    # Static deployment configuration
```
