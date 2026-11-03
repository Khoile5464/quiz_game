/* MLN122 story: every formula used by the simulations lives here (pure functions, no DOM).
   Base numbers follow the spinning-mill example in the course slides (Session 8, ch.3 §3.1.1):
   20 kg of yarn = 20$ cotton + 4$ machine wear + 6$ new value (12 h × 0.5$/h); labour power costs 3$/day
   → value 30$, cost 27$, surplus value m = 3$.
   Tested by tools/test-story.js. Runs in the browser (global StoryMath) and in node (module.exports). */
const StoryMath = (() => {
  const MILL = {cottonPerKg: 1, wearPerKg: 0.2, valuePerHour: 0.5, socialKgPerHour: 20 / 12, laborPowerValue: 3, day: 12};
  const kgValue = (m = MILL) => m.cottonPerKg + m.wearPerKg + m.valuePerHour / m.socialKgPerHour; // social value of 1 kg of yarn

  /* one working day of the mill
     workers, hours: length of the working day; wage: paid per worker per day;
     tech: own productivity ÷ social productivity (>1 = machines ahead of rivals → excess surplus value);
     wageGoods: productivity in the sectors producing workers' necessities (>1 = labour power gets cheaper → relative surplus value) */
  function millDay({workers = 1, hours = 12, wage = null, tech = 1, wageGoods = 1} = {}, m = MILL){
    const lpv = m.laborPowerValue / wageGoods;              // value of labour power
    const w = wage == null ? lpv : wage;                    // wage actually paid
    const kg = m.socialKgPerHour * tech * hours * workers;  // yarn produced
    const c = (m.cottonPerKg + m.wearPerKg) * kg;           // constant capital used up
    const v = w * workers;                                  // variable capital
    const W = kgValue(m) * kg;                              // sold at its SOCIAL value
    const surplus = W - c - v;
    const normal = (m.valuePerHour * hours - w) * workers;  // surplus at the social standard
    const necessary = w / m.valuePerHour;                   // necessary labour time t (h)
    return {kg, c, v, m: surplus, W, newValue: W - c, mNormal: normal, mExcess: surplus - normal,
      rate: v ? surplus / v : 0, t: necessary, tSurplus: hours - necessary, lpv, belowValue: w < lpv - 1e-9,
      k: c + v, profitRate: c + v ? surplus / (c + v) : 0, organic: v ? c / v : 0};
  }

  const valueOf = (c, v, m) => c + v + m;
  const surplusRate = (m, v) => m / v;
  const surplusRateByTime = (tSurplus, t) => tSurplus / t;
  const surplusMass = (rate, V) => rate * V;
  const costPrice = (c, v) => c + v;
  const profitRate = (p, c, v) => p / (c + v);
  const turnover = (CH, ch) => CH / ch;

  /* average profit: industries [{c, v}] with the same rate of surplus value → production prices (k + average profit) */
  function averageProfit(industries, rate){
    const rows = industries.map(x => { const m = x.v * rate; return {...x, m, value: x.c + x.v + m, p1: m / (x.c + x.v)}; });
    const avg = rows.reduce((s, r) => s + r.m, 0) / rows.reduce((s, r) => s + r.c + r.v, 0);
    return {avg, rows: rows.map(r => ({...r, pAvg: avg * (r.c + r.v), price: r.c + r.v + avg * (r.c + r.v)}))};
  }

  /* accumulation: share of m turned into extra capital, split by the chosen organic composition c/v */
  function accumulate({c, v, m, share, organic}){
    const add = m * share;
    const addV = add / (1 + organic), addC = add - addV;
    return {consumed: m - add, c: c + addC, v: v + addV, organic: (c + addC) / (v + addV)};
  }

  /* ---------- chapter 2: commodities, money, market ----------
     A weaver's day at the market (illustrative numbers, labelled as such in the story).
     socialHours: socially necessary labour time per cloth; myHours: this weaver's individual time. */
  function weaverSale({socialHours = 2, myHours = 2, valuePerHour = 1} = {}){
    const value = socialHours * valuePerHour;   // the market pays the SOCIAL value
    const cost = myHours * valuePerHour;        // labour actually spent, valued at the same rate
    return {value, cost, gain: value - cost, meets: myHours <= socialHours};
  }
  /* productivity vs intensity over a working day: productivity multiplies output only, intensity multiplies output AND labour spent;
     complexity: complex labour counts as a multiple of simple labour */
  function laborDay({hours = 8, baseUnits = 4, productivity = 1, intensity = 1, complexity = 1, valuePerHour = 1} = {}){
    const units = baseUnits * productivity * intensity;
    const total = hours * intensity * complexity * valuePerHour;
    return {units, total, unit: total / units};
  }
  /* market price swings around value with supply and demand (demand = demand able to pay) */
  const marketPrice = (value, demand, supply, k = .5) => value * Math.pow(demand / supply, k);
  /* law of money circulation: M = P·Q / V; issuing more than needed raises the price level */
  const moneyNeeded = (prices, velocity) => prices / velocity;
  const priceLevel = (issued, needed) => issued / needed;

  /* ---------- chapter 4: competition and monopoly ----------
     one year of free competition: the smallest surviving mill loses `step` points of market share to the largest
     (bankrupt or bought up at 0, kept in the array so names stay aligned). Shares always sum to 100. */
  function competeYear(shares, step = 8){
    const s = shares.slice(), alive = s.filter(x => x > 0);
    if (alive.length < 2) return s;
    const small = s.indexOf(Math.min(...alive)), big = s.indexOf(Math.max(...s));
    const take = Math.min(step, s[small]); s[small] -= take; s[big] += take;
    return s;
  }
  /* monopoly prices for a group controlling `share` (0..1) of the market:
     sells above value, buys raw material below value. Monopoly profit is a REDISTRIBUTION:
     what the group gains, buyers and small suppliers lose (price does not abolish the law of value). */
  function monopoly({share, value = 30, qSell = 100, qBuy = 100}){
    const sellP = value * (1 + .6 * share * share), buyP = value * (1 - .3 * share * share);
    const fromBuyers = (sellP - value) * qSell * share, fromSuppliers = (value - buyP) * qBuy * share;
    return {sellP, buyP, fromBuyers, fromSuppliers, extra: fromBuyers + fromSuppliers};
  }

  const api = {competeYear, monopoly, weaverSale, laborDay, marketPrice, moneyNeeded, priceLevel, MILL, kgValue, millDay, valueOf, surplusRate, surplusRateByTime, surplusMass, costPrice, profitRate, turnover, averageProfit, accumulate};
  if (typeof module !== "undefined") module.exports = api;
  return api;
})();
