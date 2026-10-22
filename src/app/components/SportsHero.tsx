"use client";
import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
const scenes = [
  ["nhl-arena", "NHL", "Under the lights"], ["nhl-action", "NHL", "On the ice"],
  ["nba-arena", "NBA", "Court vision"], ["nba-action", "NBA", "Above the rim"],
  ["nfl-stadium", "NFL", "Sunday lights"], ["nfl-action", "NFL", "Every yard counts"],
  ["mlb-ballpark", "MLB", "At the ballpark"], ["mlb-detail", "MLB", "A game of inches"],
];
export default function SportsHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setReduced(media.matches);
    const visibility = () => setVisible(!document.hidden);
    motion(); visibility();
    media.addEventListener("change", motion);
    document.addEventListener("visibilitychange", visibility);
    return () => { media.removeEventListener("change", motion); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    if (paused || reduced || !visible) return;
    const timer = setInterval(() => setActive(index => (index + 1) % scenes.length), 7000);
    return () => clearInterval(timer);
  }, [paused, reduced, visible, active]);
  return <section aria-label="SportsBooks introduction" aria-roledescription="carousel" className="sports-hero relative isolate overflow-hidden border-b bg-[#0b0d10] text-[#f7f7fa]">
    <div className="absolute inset-0 -z-20" aria-hidden="true">
      {scenes.map(([id], index) => <img key={id} src={`/images/hero/${id}.webp`} alt="" width="1672" height="941" fetchPriority={index === 0 ? "high" : "low"} loading={index < 2 ? "eager" : "lazy"} className={`absolute h-full w-full object-cover object-[65%_center] transition-opacity duration-1000 motion-reduce:transition-none ${index === active ? "opacity-100" : "opacity-0"}`} />)}
    </div>
    <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,12,18,.96)_0%,rgba(6,12,18,.78)_40%,rgba(6,12,18,.18)_100%)]" />
    <div className="mx-auto flex min-h-[430px] max-w-[1440px] flex-col justify-between gap-12 px-5 py-10 sm:min-h-[470px] sm:px-9 sm:py-12">
      <div className="flex items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[.2em] text-[#b8c2ce]">
        <span>Four leagues. Every angle.</span><span className="text-[#14aff1]">The game, in focus</span>
      </div>
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div><p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-[#14aff1]"><span className="h-1.5 w-1.5 bg-[#14aff1]" />Clarity in every line</p>
          <h1 className="text-5xl font-semibold tracking-[-.055em] sm:text-7xl">Find your edge<span className="text-[#14aff1]">.</span></h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#d2dce5]">One workspace to compare odds, balance stakes, and understand the numbers behind every outcome.</p>
        </div>
        <div className="flex items-center gap-2 self-start border border-white/30 bg-black/25 px-4 py-3 text-xs text-[#d2dce5] md:self-auto"><span className="h-2 w-2 bg-[#ffbe11]" />Sample data · editable prices</div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-5">
        <p className="text-xs text-[#d2dce5]"><span className="mr-3 font-semibold text-[#14aff1]">{scenes[active][1]}</span>{scenes[active][2]}<span className="ml-3 text-[#b8c2ce]">0{active+1} / 08</span></p>
        <div className="flex items-center gap-2">
          {scenes.map(([, league, title], index) => <button key={title} onClick={() => {setActive(index); setPaused(true);}} aria-label={`Show ${league}: ${title}`} aria-pressed={index === active} className="flex h-8 w-6 items-center justify-center"><span className={`h-0.5 w-full ${index === active ? "bg-[#14aff1]" : "bg-white/35"}`} /></button>)}
          <button onClick={() => {setPaused(!(paused || reduced)); if (reduced) setReduced(false);}} aria-label={paused || reduced ? "Play hero rotation" : "Pause hero rotation"} className="ml-2 border border-white/30 p-2">{paused || reduced ? <Play size={14}/> : <Pause size={14}/>}</button>
        </div>
      </div>
    </div>
  </section>;
}
