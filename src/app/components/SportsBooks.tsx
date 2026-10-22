"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Check,
  ChevronRight,
  Moon,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Sun,
  Trash2,
} from "lucide-react";
import SportsHero from "./SportsHero";
import FixturePicker from "./FixturePicker";
import type {League,Fixture} from "@/lib/fixtures";
import { allocate, parseOdds } from "@/lib/market";
type Market = "Moneyline" | "Spread" | "Total";
type Book = { name: string; prices: Record<Market, [string, string]> };
const samples: Book[] = [
  {
    name: "Sports Interaction",
    prices: {
      Moneyline: ["2.10", "1.80"],
      Spread: ["1.43", "2.75"],
      Total: ["1.87", "1.95"],
    },
  },
  {
    name: "DraftKings",
    prices: {
      Moneyline: ["1.65", "2.30"],
      Spread: ["1.50", "2.60"],
      Total: ["1.91", "1.91"],
    },
  },
  {
    name: "Pinnacle",
    prices: {
      Moneyline: ["2.02", "1.87"],
      Spread: ["1.45", "2.65"],
      Total: ["1.93", "1.93"],
    },
  },
  {
    name: "FanDuel",
    prices: {
      Moneyline: ["2.05", "1.83"],
      Spread: ["1.48", "2.55"],
      Total: ["1.91", "1.91"],
    },
  },
  {
    name: "BetMGM",
    prices: {
      Moneyline: ["2.00", "1.85"],
      Spread: ["1.40", "2.60"],
      Total: ["1.85", "1.95"],
    },
  },
];
const money = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
    n,
  );
const field =
  "w-full border bg-background px-3 py-3 text-sm font-medium";
export default function Calculator() {
  const [dark, setDark] = useState(true),
    [sport, setSport] = useState("NHL"),
    [pair, setPair] = useState(["Toronto Maple Leafs", "Montréal Canadiens"]);
  const selectFixture = useCallback((league:League,fixture:Fixture)=>{setSport(league);setPair([fixture.away,fixture.home])},[]);
  const [market, setMarket] = useState<Market>("Moneyline"),
    [format, setFormat] = useState<"decimal" | "american">("decimal"),
    [budget, setBudget] = useState("100"),
    [books, setBooks] = useState<Book[]>(samples),
    [newName, setNewName] = useState(""),
    [adding, setAdding] = useState(false),
    [line, setLine] = useState("6.5");
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("sportsbooks.theme", next ? "dark" : "light");
    } catch {}
  }
  function changeFormat(next: "decimal" | "american") {
    if (next === format) return;
    setBooks((prev) =>
      prev.map((b) => ({
        ...b,
        prices: Object.fromEntries(
          Object.entries(b.prices).map(([m, p]) => [
            m,
            p.map((v) => {
              const d = parseOdds(v, format);
              return d === null
                ? ""
                : next === "decimal"
                  ? d.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")
                  : String(Math.round(d >= 2 ? (d - 1) * 100 : -100 / (d - 1)));
            }),
          ]),
        ) as Book["prices"],
      })),
    );
    setFormat(next);
  }
  const best = [0, 1].map((side) =>
    books.reduce<{ odds: number; name: string } | null>((acc, b) => {
      const odds = parseOdds(b.prices[market][side], format);
      return odds !== null && (!acc || odds > acc.odds)
        ? { odds, name: b.name }
        : acc;
    }, null),
  );
  const validBudget = Number(budget) > 0 && Number.isFinite(Number(budget));
  const validLine =
    market === "Moneyline" ||
    (Number.isFinite(Number(line)) &&
      Number(line) > 0 &&
      Number(line) % 1 === 0.5);
  const result =
    best[0] && best[1] && validBudget && validLine
      ? allocate(best[0].odds, best[1].odds, Number(budget))
      : null;
  const labels =
    market === "Total"
      ? [`Over ${line}`, `Under ${line}`]
      : market === "Spread"
        ? [`${pair[0]} −${line}`, `${pair[1]} +${line}`]
        : pair;
  function reset() {
    setBooks(samples);
    setFormat("decimal");
    setBudget("100");
  }
  return (
    <div className="min-h-screen">
      <a
        href="#workspace"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-card focus:p-4"
      >
        Skip to calculator
      </a>
      <header className="border-b bg-card/70">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-5 sm:px-9">
          <a
            href="/home"
            className="flex items-center gap-3 font-bold tracking-tight"
          >
            <span className="bg-accent p-2 text-accent-foreground">
              <Activity size={22} />
            </span>
            <span className="text-xl">
              SportsBooks<span className="text-accent">.</span>
            </span>
          </a>
          <div className="flex items-center gap-5">
            <span className="hidden text-xs uppercase tracking-[.18em] text-muted sm:block">
              The odds workspace
            </span>
            <button
              onClick={toggle}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              className="border p-3 hover:bg-background"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>
      <SportsHero />
      <main
        id="workspace"
        className="mx-auto max-w-[1440px] px-5 py-8 sm:px-9 sm:py-12"
      >
        <FixturePicker onSelect={selectFixture}/>
        <section
          aria-label="Market setup"
          className="mb-7 border bg-card p-5 sm:p-6"
        >
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal size={16} className="text-accent" /> Market setup
            <span className="ml-auto text-xs font-normal text-muted">
              01 / Configure
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            <label className="space-y-2 text-xs text-muted">
              <span>Total stake · CAD</span>
              <input
                className={field}
                type="number"
                min="0.01"
                step="0.01"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                aria-invalid={!validBudget}
              />
            </label>
            <label className="space-y-2 text-xs text-muted">
              <span>Odds format</span>
              <select
                aria-label="Odds format"
                className={field}
                value={format}
                onChange={(e) => changeFormat(e.target.value as typeof format)}
              >
                <option value="decimal">Decimal</option>
                <option value="american">American</option>
              </select>
            </label>
          </div>
          {!validBudget && (
            <p role="alert" className="mt-3 text-sm text-red-500">
              Enter a positive stake.
            </p>
          )}
        </section>
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
          <section className="min-w-0 border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-semibold">Odds comparison</h2>
                <p className="mt-1 text-xs text-muted">
                  {books.length} bookmakers · best prices highlighted
                </p>
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-2 border px-3 py-2 text-xs hover:bg-background"
              >
                <RotateCcw size={14} /> Reset prices
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 px-5 py-5 sm:px-6">
              <div
                className="flex bg-background p-1"
                role="group"
                aria-label="Market"
              >
                {(["Moneyline", "Spread", "Total"] as Market[]).map((m) => (
                  <button
                    key={m}
                    aria-pressed={market === m}
                    onClick={() => {
                      setMarket(m);
                      setLine(m === "Spread" ? "1.5" : "6.5");
                    }}
                    className={`px-3 py-2 text-xs font-semibold sm:px-4 ${market === m ? "bg-accent text-accent-foreground" : "text-muted hover:text-foreground"}`}
                  >
                    {m === "Spread" && sport === "NHL" ? "Puck line" : m}
                  </button>
                ))}
              </div>
              {market !== "Moneyline" && (
                <label className="flex items-center gap-2 text-xs text-muted">
                  Line
                  <input
                    aria-label="Market line"
                    className="w-20 border bg-background p-2"
                    type="number"
                    min="0.5"
                    step="1"
                    value={line}
                    onChange={(e) => setLine(e.target.value)}
                  />
                </label>
              )}
            </div>
            {!validLine && (
              <p role="alert" className="px-6 pb-4 text-sm text-red-500">
                Use a positive half-point line for a two-outcome market.
              </p>
            )}
            <div className="hidden grid-cols-[1.15fr_1fr_1fr] gap-4 border-y bg-background/50 px-6 py-3 text-[11px] uppercase tracking-wider text-muted sm:grid">
              <span>Bookmaker</span>
              {labels.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
            <div className="divide-y">
              {books.map((b, idx) => (
                <div
                  key={b.name}
                  className="grid gap-4 p-5 sm:grid-cols-[1.15fr_1fr_1fr] sm:items-center sm:px-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center border bg-background text-xs font-bold text-muted">
                      {b.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                    <span className="text-sm font-semibold">{b.name}</span>
                    {idx >= 5 && (
                      <button
                        className="ml-auto p-2 text-muted"
                        aria-label={`Remove ${b.name}`}
                        onClick={() =>
                          setBooks((p) => p.filter((x) => x.name !== b.name))
                        }
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:contents">
                    {[0, 1].map((i) => {
                      const d = parseOdds(b.prices[market][i], format),
                        win = d !== null && d === best[i]?.odds;
                      return (
                        <label key={i} className="min-w-0">
                          <span className="mb-2 block truncate text-[11px] text-muted sm:sr-only">
                            {labels[i]}
                          </span>
                          <div
                            className={`flex items-center border px-3 ${win ? "border-accent/40 bg-accent/10" : "bg-background"}`}
                          >
                            <input
                              aria-label={`${b.name} ${labels[i]} odds`}
                              aria-invalid={d === null}
                              inputMode="decimal"
                              className={`w-full bg-transparent py-3 font-mono text-sm outline-none ${win ? "text-accent" : ""}`}
                              value={b.prices[market][i]}
                              onChange={(e) =>
                                setBooks((p) =>
                                  p.map((x, j) =>
                                    j === idx
                                      ? {
                                          ...x,
                                          prices: {
                                            ...x.prices,
                                            [market]: x.prices[market].map(
                                              (v, k) =>
                                                k === i ? e.target.value : v,
                                            ) as [string, string],
                                          },
                                        }
                                      : x,
                                  ),
                                )
                              }
                            />
                            {win && (
                              <ArrowUpRight
                                size={15}
                                className="shrink-0 text-accent"
                              />
                            )}
                          </div>
                          {d === null && (
                            <span className="mt-1 block text-xs text-red-500">
                              {format === "decimal"
                                ? "Enter odds above 1"
                                : "Use +100 or higher, −100 or lower"}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-5 sm:px-6">
              {adding ? (
                <form
                  className="flex flex-wrap gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const name = newName.trim();
                    if (
                      !name ||
                      books.some(
                        (b) => b.name.toLowerCase() === name.toLowerCase(),
                      )
                    )
                      return;
                    setBooks((p) => [
                      ...p,
                      {
                        name,
                        prices: {
                          Moneyline: ["", ""],
                          Spread: ["", ""],
                          Total: ["", ""],
                        },
                      },
                    ]);
                    setNewName("");
                    setAdding(false);
                  }}
                >
                  <input
                    autoFocus
                    required
                    maxLength={40}
                    aria-label="Bookmaker name"
                    placeholder="Bookmaker name"
                    className="min-w-0 flex-1 border bg-background px-3 py-2 text-sm"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <button
                    className="bg-accent px-4 py-2 text-sm text-accent-foreground"
                    disabled={
                      !newName.trim() ||
                      books.some(
                        (b) =>
                          b.name.toLowerCase() === newName.trim().toLowerCase(),
                      )
                    }
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="px-2 text-sm text-muted"
                    onClick={() => setAdding(false)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setAdding(true)}
                  className="flex items-center gap-2 text-xs font-semibold text-muted hover:text-accent"
                >
                  <Plus size={16} /> Add bookmaker
                </button>
              )}
            </div>
          </section>
          <aside className="space-y-5 xl:sticky xl:top-6">
            <section className="overflow-hidden border border-accent/30 bg-card">
              <div className="border-b border-accent/20 bg-accent/5 p-6">
                <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-accent">
                  <Activity size={14} /> Market intelligence
                </p>
                <h2 className="mt-5 text-xl font-semibold">
                  {!result
                    ? "Complete the market"
                    : result.profit > 0
                      ? "Positive price edge"
                      : "No positive edge"}
                </h2>
                <p className="mt-2 text-xs leading-5 text-muted">
                  {result
                    ? "Based on the best available price for each outcome."
                    : "Enter valid prices for both outcomes and a positive stake."}
                </p>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted">
                      Modelled return on stake
                    </p>
                    <p
                      data-testid="roi"
                      className={`mt-2 font-mono text-4xl tracking-tight ${result && result.profit > 0 ? "text-accent" : ""}`}
                    >
                      {result
                        ? `${result.roi > 0 ? "+" : ""}${result.roi.toFixed(2)}%`
                        : "—"}
                    </p>
                  </div>
                  <ArrowUpRight size={32} className="mb-1 text-accent" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-4 flex justify-between text-sm font-semibold">
                  Stake allocation
                  <span className="text-xs font-normal text-muted">CAD</span>
                </h3>
                {labels.map((label, i) => (
                  <div key={label} className="mb-4">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium">{label}</p>
                        <p className="mt-1 text-[11px] text-muted">
                          {best[i]?.name ?? "Awaiting prices"}
                        </p>
                      </div>
                      <span className="font-mono text-sm">
                        {result ? money(result.stakes[i]) : "—"}
                      </span>
                    </div>
                    <div className="h-1.5 bg-background">
                      <div
                        className={`h-full ${i === 0 ? "bg-accent" : "bg-[#ffbe11]"}`}
                        style={{
                          width: result
                            ? `${(result.stakes[i] / Number(budget)) * 100}%`
                            : "0%",
                        }}
                      />
                    </div>
                  </div>
                ))}
                <dl className="mt-6 space-y-3 border-t pt-5 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-muted">Minimum gross payout</dt>
                    <dd className="font-mono">
                      {result ? money(result.payout) : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Net result</dt>
                    <dd data-testid="profit" className="font-mono font-bold">
                      {result ? money(result.profit) : "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>
            <section className="border p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Check size={16} className="text-accent" /> Know the assumptions
              </h3>
              <p className="mt-3 text-xs leading-6 text-muted">
                Manual sample prices, not a live feed. Compare the same event,
                line, and settlement rules. Calculations assume two exhaustive
                outcomes and exclude fees, limits, and odds changes.
              </p>
            </section>
          </aside>
        </div>
        <section className="mt-8 grid gap-5 border-t pt-7 sm:grid-cols-3">
          {[
            [
              "01",
              "Set your market",
              "Choose an event, odds format, and total stake.",
            ],
            [
              "02",
              "Compare the prices",
              "Edit each book’s odds. Highlighted cells show the best price.",
            ],
            [
              "03",
              "Understand the split",
              "See balanced stakes and the resulting minimum payout.",
            ],
          ].map(([n, t, d]) => (
            <div key={n} className="flex gap-3">
              <span className="font-mono text-xs text-accent">{n}</span>
              <div>
                <h3 className="text-sm font-semibold">{t}</h3>
                <p className="mt-2 text-xs leading-5 text-muted">{d}</p>
              </div>
            </div>
          ))}
        </section>
        <footer className="mt-10 flex flex-wrap justify-between gap-3 border-t pt-6 text-[11px] text-muted">
          <span>SportsBooks / An independent odds workspace</span>
          <span>
            Educational calculator · 18+ · Play responsibly{" "}
            <ChevronRight className="inline" size={12} />
          </span>
        </footer>
      </main>
    </div>
  );
}
