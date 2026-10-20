# Sportsbooks

A typed odds comparison tool that calculates implied probabilities and potential arbitrage allocations from manually entered odds.

[Live demo](https://jp-sportsbooks.vercel.app/)

## What it does

Enter odds for moneyline, puck line or totals markets to compare implied probabilities and calculate possible stake allocations. The app works with manually entered values; it does not fetch live bookmaker feeds or place bets. Calculations do not account for changing odds, fees, stake limits or differences in settlement rules.

## Local development

Run these commands from the repository root:

```sh
npm install
npm run dev
```

Available scripts:

- `npm run build`: `next build`.
- `npm run lint`: `next lint`.

## Main dependencies

`react`, `next`. See `package.json` for the full dependency list and versions.
