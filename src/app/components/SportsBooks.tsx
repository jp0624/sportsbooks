"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import HockeyTeams from "@/data/teams/hockey.json";
import SportsBooks from "@/data/sportsBooks.json";
import SelectionBar from "./SelectionsBar";
import SportsBookTable from "./SportsBookTable";
import ArbitrageResults from "./ArbitrageResults"; // ✅ Import

type oddValue = {
  total: string;
  label?: "Over" | "Under";
};

type Odds = {
  name: string;
  type: string;
  values: oddValue[];
};

type SportsBook = {
  name: string;
  logo?: string;
  odds: Odds[];
};

function Calculator() {
  const sports = [
    {
      name: "Hockey",
      teams: HockeyTeams,
    },
    {
      name: "Football",
      teams: [{ name: "Team A" }, { name: "Team B" }],
    },
    {
      name: "Basketball",
      teams: [{ name: "Team A" }, { name: "Team B" }],
    },
    {
      name: "Baseball",
      teams: [{ name: "Team A" }, { name: "Team B" }],
    },
  ];

  const defaultTeams = sports
    .find((s) => s.name === "Hockey")
    ?.teams.slice(0, 2)
    .map((t) => t.name) || ["Team A", "Team B"];

  const [sport, setSport] = useState<(typeof sports)[0] | undefined>(sports[0]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>(defaultTeams);
  const [defaultBetAmount, setDefaultBetAmount] = useState(100);
  const [sportsBooks, setSportsBooks] = useState<SportsBook[]>(
    SportsBooks.map((book: any) => ({
      ...book,
      odds: book.odds.map((odds: any) => ({
        ...odds,
        values: (odds.values as any[]).map((v: any) => {
          if (typeof v === "string") {
            return { total: v };
          }
          return {
            total: v.total ?? (typeof v.value === "string" ? v.value : ""),
            label:
              v.label === "Over"
                ? "Over"
                : v.label === "Under"
                ? "Under"
                : undefined,
          };
        }),
      })),
    }))
  );

  const [showModal, setShowModal] = useState(false);
  const [newBookName, setNewBookName] = useState("");
  const [newBookLogo, setNewBookLogo] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "spread",
    "total",
    "moneyline",
  ]);
  const [formError, setFormError] = useState("");

  function isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  function handleSportChange(value: string) {
    const selectedSport = sports.find((s) => s.name === value);
    setSport(selectedSport);
    if (selectedSport?.teams) {
      setSelectedTeams(selectedSport.teams.slice(0, 2).map((t) => t.name));
    } else {
      setSelectedTeams(["Team A", "Team B"]);
    }
  }

  function handleTeamChange(index: number, value: string) {
    setSelectedTeams((prev) => {
      const newTeams = [...prev];
      newTeams[index] = value;
      return newTeams;
    });
  }

  function handleBetAmountChange(value: number) {
    setDefaultBetAmount(value);
  }

  const handleAddSportsBook = () => {
    setFormError("");

    if (!newBookName.trim()) {
      setFormError("Sportsbook name is required.");
      return;
    }

    if (newBookLogo.trim() && !isValidUrl(newBookLogo.trim())) {
      setFormError("Please enter a valid URL for the logo.");
      return;
    }

    const newOdds = selectedTypes.map((type) => {
      let name = "";
      let oddsType: "moneyline" | "overunder" | "spread" | "total" | "puckline";
      if (type === "spread") {
        name = "Puck Line";
        oddsType = "spread";
      } else if (type === "total") {
        name = "Total";
        oddsType = "overunder";
      } else if (type === "moneyline") {
        name = "Moneyline";
        oddsType = "moneyline";
      } else if (type === "puckline") {
        name = "Puck Line";
        oddsType = "puckline";
      } else {
        name = type.charAt(0).toUpperCase() + type.slice(1);
        oddsType = type as typeof oddsType;
      }

      return {
        name,
        type: oddsType,
        values: selectedTeams.map(() => ({
          label: type === "total" ? ("Over" as "Over") : undefined,
          total: "",
        })),
      };
    });

    const newBook: SportsBook = {
      name: newBookName.trim(),
      logo: newBookLogo.trim() || undefined,
      odds: newOdds,
    };

    setSportsBooks((prev) => [...(prev ?? []), newBook]);
    setShowModal(false);
    setNewBookName("");
    setNewBookLogo("");
    setSelectedTypes(["spread", "total", "moneyline"]);
    setFormError("");
  };

  const handleSportsBookChange = (
    sportsBookIndex: number,
    betTypeIndex: number,
    teamIndex: number,
    newValue: string,
    label?: "Over" | "Under"
  ) => {
    setSportsBooks((prev) => {
      const newBooks = [...(prev ?? [])];
      const betType = newBooks[sportsBookIndex].odds[betTypeIndex];
      betType.values[teamIndex] = {
        ...betType.values[teamIndex],
        total: newValue,
        ...(label ? { label } : {}),
      };
      return newBooks;
    });
  };

  // ✅ Transform data for ArbitrageResults
  const transformedBooks = sportsBooks.map((book) => ({
    name: book.name,
    odds: book.odds.map((o) => ({
      name: o.name,
      values: o.values.map((v) => v.total),
    })),
  }));

  const betTypes = Array.from(
    new Set(sportsBooks.flatMap((book) => book.odds.map((odds) => odds.name)))
  ).map((name) => ({ name }));

  return (
    <>
      <SelectionBar
        sports={sports}
        sport={sport}
        defaultTeams={selectedTeams.map((team) => ({ name: team }))}
        defaultBetAmount={defaultBetAmount}
        selectedTeams={selectedTeams}
        handleBetAmountChange={handleBetAmountChange}
        handleSportChange={handleSportChange}
        handleTeamChange={handleTeamChange}
      />

      <p>Total Spent per Betting Type: {defaultBetAmount}</p>

      {/* ✅ Arbitrage Results before SportsBookTable list */}
      <ArbitrageResults
        sportsBooks={transformedBooks}
        selectedTeams={selectedTeams}
        betTypes={betTypes}
        defaultBetAmount={defaultBetAmount}
      />

      {(sportsBooks ?? []).map((sportsBook, sIndex) => (
        <SportsBookTable
          key={sportsBook.name}
          sportsBook={sportsBook}
          selectedTeams={selectedTeams}
          onOddsChange={(betTypeIndex, teamIndex, value, label) =>
            handleSportsBookChange(
              sIndex,
              betTypeIndex,
              teamIndex,
              value,
              label
            )
          }
        />
      ))}

      <div className="flex flex-row items-center justify-center gap-2 mt-4">
        <Button
          onClick={() => setShowModal(true)}
          className=" text-white px-4 py-2 rounded-md shadow hover:cursor-pointer"
        >
          Add Sportsbook
        </Button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Add New Sportsbook</h2>

            {formError && (
              <p className="text-red-600 text-sm font-medium">{formError}</p>
            )}

            <input
              type="text"
              placeholder="Sportsbook Name"
              value={newBookName}
              onChange={(e) => setNewBookName(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Logo URL (optional)"
              value={newBookLogo}
              onChange={(e) => setNewBookLogo(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <div className="space-y-2">
              <label className="block font-medium">Supported Bet Types:</label>
              {["spread", "total", "moneyline"].map((type) => (
                <label key={type} className="block">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() =>
                      setSelectedTypes((prev) =>
                        prev.includes(type)
                          ? prev.filter((t) => t !== type)
                          : [...prev, type]
                      )
                    }
                    className="mr-2"
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSportsBook}
                className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Calculator;
