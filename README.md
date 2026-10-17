# FairShare NJ

One radar for every affordable-housing lottery in New Jersey's 12th Congressional District.
Built for the 2026 Congressional App Challenge (NJ-12) by students from Monroe Township, NJ.

**What it does**
- Runs the official NJHMFA **UHAC 2025** income-limit table (parsed from the state PDF into versioned JSON, unit-tested) to tell a household its tier — very-low / low / moderate — and show the math.
- Aggregates lotteries and waiting lists across administrative agents (CGP&H, Piazza, Princeton Community Housing) into one feed with deadlines, rents, bedroom counts and official apply links. FairShare never submits applications.
- Calendar alerts (`.ics`, 7-day and 1-day reminders) for starred lotteries.
- Document checklist in English, Spanish, Hindi and Gujarati with on-device progress.
- Leaflet map of listings against the NJ Transit Northeast Corridor.
- Town scoreboard: DCA Fourth Round (2025–2035) obligations for all 32 NJ-12 municipalities vs. units that have actually reached a lottery.

Everything is local-first: no backend, no account, nothing leaves the phone. Installs as a PWA.

## Deploy

Pushes to `main` build a static export and publish it to GitHub Pages via `.github/workflows/pages.yml`: https://tanaypatel917-lab.github.io/fairshare-nj/

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npx vitest run     # eligibility engine tests
npm run lint && npx tsc --noEmit && npm run build
```

## Data
| Data | Source |
| --- | --- |
| Income tiers | `src/data/uhac2025.json` ← NJHMFA UHAC income limits PDF (effective 2025) |
| Town obligations | `src/data/towns.json` ← NJ DCA `FourthRoundCalculation_Workbook.xlsx`, Final Summary sheet |
| Lotteries | `src/data/listings.json` ← agent postings + local reporting; each record carries `sources[]` and `lastChecked` |

## Stack
Next.js 14 (App Router, static export-ready) · TypeScript · Tailwind · Leaflet · Vitest.
Type: Cabinet Grotesk, General Sans, Instrument Serif, IBM Plex Mono (Fontshare / Google, self-hosted).
