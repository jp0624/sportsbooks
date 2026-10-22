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

## Visual system

Fieldnotes-inspired charcoal (#0b0d10), cyan (#14aff1), and yellow (#ffbe11) anchor the dark theme; light mode uses cool white and a deeper accessible cyan. All panels and controls use square corners.

The full-width hero contains eight original AI-generated sports scenes, two each for NHL, NBA, NFL and MLB. Optimized WebP assets live in `public/images/hero`. They are decorative illustrations of each sport, not real event photographs or official team artwork. Intro content remains HTML over a contrast overlay. Slides crossfade every seven seconds; image selectors pause autoplay, a play/pause control is available, hidden tabs pause, and reduced-motion users start with a static image.
