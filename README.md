# SportsBooks

A responsive, dark-first odds comparison workspace built with Next.js 15, React 19, and Tailwind CSS 4 via its PostCSS integration. Theme tokens are CSS variables; layout and components use Tailwind utilities. The light/dark preference persists locally and is applied before paint.

## Run

```sh
npm ci
npm run dev
npm run build
npm test
npm run lint
```

Deploy with Vercel's Next.js preset. No API keys or backend required.

## Calculator

All displayed prices are editable examples, not live quotes. Compare moneyline, half-point spread/puck-line, and half-point totals across bookmakers. Decimal and American formats are supported. Best prices are selected per outcome; the allocated stake is rounded to cents and the minimum gross payout is computed from those rounded stakes. The net result subtracts the total stake. A non-positive edge is shown explicitly.

Only two exhaustive outcomes with matching event, line, and settlement rules are supported. Whole-point lines (possible pushes), fees, limits, and changing odds are not modelled. Sport/team changes relabel the hypothetical scenario, not fetch new prices. Changes to prices last for the current session; Reset prices restores the examples. No bets are placed.
