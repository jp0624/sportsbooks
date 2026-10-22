"use client";
import React from "react";

type ArbitrageOpportunity = {
  betType: string;
  arbitrageMargin: number;
  opportunities: {
    sportsbook: string;
    team: string;
    odds: number;
    stake: number;
    payout: number;
  }[];
  totalStake: number;
  guaranteedProfit: number;
};

interface Props {
  sportsBooks: {
    name: string;
    odds: { name: string; values: string[] }[]; // e.g., moneyline, totals, puckline
  }[];
  selectedTeams: string[];
  betTypes: { name: string }[];
  defaultBetAmount: number;
}

function ArbitrageResults({
  sportsBooks,
  selectedTeams,
  betTypes,
  defaultBetAmount,
}: Props) {
  function parseOdds(oddStr: string): number {
    const num = parseFloat(oddStr);
    if (isNaN(num)) return 0;
    // Assuming odds are decimal, convert American odds if needed:
    return num >= 1.01
      ? num
      : num > 0
      ? 1 + num / 100
      : 1 + 100 / Math.abs(num);
  }

  const calculateArbitrage = (): ArbitrageOpportunity[] => {
    return betTypes
      .map((betType) => {
        const oddsData: {
          sportsbook: string;
          team: string;
          odds: number;
        }[] = [];

        sportsBooks.forEach((book) => {
          const oddsEntry = book.odds.find((o) => o.name === betType.name);
          if (!oddsEntry || oddsEntry.values.length < 2) return;

          oddsEntry.values.forEach((oddStr, teamIndex) => {
            const odds = parseOdds(oddStr);
            if (!isNaN(odds) && odds > 1) {
              oddsData.push({
                sportsbook: book.name,
                team: selectedTeams[teamIndex],
                odds,
              });
            }
          });
        });

        if (selectedTeams.length !== 2) return null;

        let bestCombo: ArbitrageOpportunity | null = null;

        for (const team1Odds of oddsData.filter(
          (o) => o.team === selectedTeams[0]
        )) {
          for (const team2Odds of oddsData.filter(
            (o) => o.team === selectedTeams[1]
          )) {
            if (team1Odds.sportsbook === team2Odds.sportsbook) continue;

            const implied1 = 1 / team1Odds.odds;
            const implied2 = 1 / team2Odds.odds;
            const totalImplied = implied1 + implied2;

            if (totalImplied < 1) {
              const totalStake = defaultBetAmount;

              const stake1 = (totalStake * implied1) / totalImplied;
              const stake2 = (totalStake * implied2) / totalImplied;

              const payout1 = stake1 * team1Odds.odds;
              const payout2 = stake2 * team2Odds.odds;

              const guaranteedProfit = payout1 - totalStake;

              bestCombo = {
                betType: betType.name,
                arbitrageMargin: parseFloat(
                  ((1 - totalImplied) * 100).toFixed(2)
                ),
                opportunities: [
                  {
                    ...team1Odds,
                    stake: parseFloat(stake1.toFixed(2)),
                    payout: parseFloat(payout1.toFixed(2)),
                  },
                  {
                    ...team2Odds,
                    stake: parseFloat(stake2.toFixed(2)),
                    payout: parseFloat(payout2.toFixed(2)),
                  },
                ],
                totalStake: parseFloat(totalStake.toFixed(2)),
                guaranteedProfit: parseFloat(guaranteedProfit.toFixed(2)),
              };
            }
          }
        }

        return bestCombo;
      })
      .filter(Boolean) as ArbitrageOpportunity[];
  };

  const results = calculateArbitrage();

  return (
    <div className="w-[90%] mx-auto mb-4">
      {results.length === 0 && (
        <p className="text-center text-red-500 my-4">
          No arbitrage opportunities found.
        </p>
      )}

      {results.map((result) => (
        <div
          key={result.betType}
          className="bg-green-50 border border-green-400 p-4 shadow-md my-4"
        >
          <h2 className="text-xl font-semibold mb-2">
            {result.betType} Arbitrage Opportunity
          </h2>
          <ul>
            {result.opportunities.map((o, i) => (
              <li key={i} className="mb-1">
                <strong>Bet</strong> ${o.stake} on <strong>{o.team}</strong> at{" "}
                <strong>{o.sportsbook}</strong> ({o.odds.toFixed(2)} odds) →{" "}
                Payout: ${o.payout}
              </li>
            ))}
          </ul>
          <p className="mt-2 font-medium">
            Total Investment: ${result.totalStake}
          </p>
          <p className="text-green-700 font-bold">
            Guaranteed Profit: ${result.guaranteedProfit}
          </p>
          <p className="text-blue-600 font-medium">
            Arbitrage Margin: {result.arbitrageMargin}%
          </p>
        </div>
      ))}
    </div>
  );
}

export default ArbitrageResults;

