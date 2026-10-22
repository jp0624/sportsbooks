"use client";
import {useMemo,useState,useEffect} from 'react';
import {leagues,fixturesForMonth,dateKey,type League,type Fixture} from '@/lib/fixtures';
export default function FixturePicker({onSelect}:{onSelect:(league:League,fixture:Fixture)=>void}){
 const [league,setLeague]=useState<League>('NHL');
 const [month,setMonth]=useState(()=>new Date(2026,9,1));
 const [selected,setSelected]=useState('');
 const [game,setGame]=useState('');
 const [ready,setReady]=useState(false);
 useEffect(()=>{const now=new Date();setMonth(new Date(now.getFullYear(),now.getMonth(),1));setReady(true)},[]);
 const fixtures=useMemo(()=>fixturesForMonth(league,month.getFullYear(),month.getMonth()),[league,month]);
 const dates=[...new Set(fixtures.map(f=>f.date))];
 const date=dates.includes(selected)?selected:dates.find(d=>d>=dateKey(new Date()))||dates[0];
 const games=fixtures.filter(f=>f.date===date);
 const current=games.find(f=>f.id===game)||games[0];
 useEffect(()=>{if(ready&&current)onSelect(league,current)},[league,current,ready,onSelect]);
 const label=month.toLocaleDateString('en-CA',{month:'long',year:'numeric'});
 const changeMonth=(n:number)=>{setMonth(new Date(month.getFullYear(),month.getMonth()+n,1));setSelected('');setGame('')};
 return <section className="mb-6 rounded-2xl border bg-card p-5 sm:p-6" aria-label="Find a game">
 <div className="mb-5 flex flex-wrap justify-between gap-3"><h2 className="font-semibold">Find your matchup</h2><span className="rounded-full border px-3 py-1 text-xs text-accent">Sample fixtures · {leagues[league].length} teams</span></div>
 <div className="grid gap-6 lg:grid-cols-[.7fr_1fr_1fr]">
 <div><label className="text-xs text-muted">01 / League<select aria-label="League" className="mt-2 w-full rounded-lg border bg-background p-3 text-sm text-foreground" value={league} onChange={e=>{setLeague(e.target.value as League);setGame('');setSelected('')}}>{Object.entries(leagues).map(([name,teams])=><option key={name} value={name}>{name} · {teams.length} teams</option>)}</select></label><p className="mt-4 text-xs leading-relaxed text-muted">Choose a league, a marked date and a game. These generated matchups are for exploring the calculator, not an official schedule.</p></div>
 <div><p className="mb-2 text-xs text-muted">02 / Game date</p><div className="rounded-xl border bg-background p-3"><div className="flex items-center justify-between mb-3"><button aria-label="Previous month" onClick={()=>changeMonth(-1)} className="rounded p-2 hover:bg-card">←</button><span className="text-sm font-semibold" aria-live="polite">{label}</span><button aria-label="Next month" onClick={()=>changeMonth(1)} className="rounded p-2 hover:bg-card">→</button></div><div className="grid grid-cols-7 gap-1 text-center text-xs">{['S','M','T','W','T','F','S'].map((d,i)=><span key={i} className="py-1 text-muted">{d}</span>)}{Array.from({length:month.getDay()},(_,i)=><span key={`empty${i}`}/>)}{Array.from({length:new Date(month.getFullYear(),month.getMonth()+1,0).getDate()},(_,i)=>{const key=dateKey(new Date(month.getFullYear(),month.getMonth(),i+1));const count=fixtures.filter(f=>f.date===key).length;return <button key={key} disabled={!count} aria-label={`${key}, ${count} sample games`} aria-pressed={date===key} onClick={()=>{setSelected(key);setGame('')}} className={`flex h-9 flex-col items-center justify-center rounded-md disabled:opacity-25 ${date===key?'bg-accent text-accent-foreground':'hover:bg-card'}`}>{i+1}{count>0&&<span className="mt-1 h-1 w-1 rounded-full bg-current"/>}</button>})}</div><p className="mt-3 text-[10px] text-muted">● Dates with sample games · Times shown in UTC</p></div></div>
 <div><label className="text-xs text-muted">03 / Game<select aria-label="Game" className="mt-2 w-full min-w-0 rounded-lg border bg-background p-3 text-sm text-foreground" value={current?.id||''} onChange={e=>setGame(e.target.value)}>{games.map(f=><option key={f.id} value={f.id}>{f.away} @ {f.home} · {f.time}</option>)}</select></label>{current&&<div className="mt-4 rounded-xl border p-4" aria-live="polite"><p className="text-xs text-accent">{date} · {current.time} UTC</p><p className="mt-3 font-semibold">{current.away}</p><span className="text-xs text-muted">at</span><p className="font-semibold">{current.home}</p></div>}</div>
 </div></section>
}
