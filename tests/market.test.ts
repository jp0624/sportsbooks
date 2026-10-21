import { test } from "node:test";
import assert from "node:assert/strict";
import { allocate, parseOdds } from "../src/lib/market.ts";
test("converts American prices and rejects invalid entries", () => {
  assert.equal(parseOdds("+110", "american"), 2.1);
  assert.equal(parseOdds("-200", "american"), 1.5);
  for (const v of ["", "0", "99", "Infinity", "2abc"])
    assert.equal(parseOdds(v, "american"), null);
  assert.equal(parseOdds("1", "decimal"), null);
});
test("balances stakes and uses actual rounded payouts", () => {
  const r = allocate(2.1, 2.3, 100)!;
  assert.equal(r.stakes[0] + r.stakes[1], 100);
  assert.ok(Math.abs(r.profit - 9.767) < 0.001);
  assert.equal(r.payout, Math.min(r.stakes[0] * 2.1, r.stakes[1] * 2.3));
});
test("negative-edge and invalid markets are handled", () => {
  assert.ok(allocate(1.91, 1.91, 100)!.profit < 0);
  assert.equal(allocate(2, 2, 0), null);
  assert.equal(allocate(1, 2, 100), null);
});
