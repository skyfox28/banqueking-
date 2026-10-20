// Récupère les cours des symboles de tickers.txt et écrit prices.json (lancé par la GitHub Action).
import { readFile, writeFile } from "node:fs/promises";

const UA = { "User-Agent": "Mozilla/5.0 (BanqueKing price bot)" };
const tickers = (await readFile("tickers.txt", "utf8"))
  .split("\n").map((l) => l.replace(/#.*/, "").trim().toUpperCase()).filter(Boolean);

// Repart du fichier publié pour garder le dernier cours connu si Yahoo ne répond pas.
let prev = { quotes: {}, fx: {} };
if (process.env.PAGES_URL) {
  try { prev = await (await fetch(`${process.env.PAGES_URL.replace(/\/$/, "")}/prices.json`)).json(); } catch {}
}

async function quote(sym) {
  for (const host of ["query1", "query2"]) {
    try {
      const r = await fetch(`https://${host}.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=1d&interval=1d`, { headers: UA });
      if (!r.ok) continue;
      const m = (await r.json()).chart?.result?.[0]?.meta;
      if (m?.regularMarketPrice) {
        return { price: m.regularMarketPrice, prev: m.previousClose ?? m.chartPreviousClose ?? null, currency: m.currency, name: m.shortName || m.longName || sym, time: m.regularMarketTime ? new Date(m.regularMarketTime * 1000).toISOString() : null };
      }
    } catch {}
  }
  return null;
}

const quotes = {};
for (const t of tickers) {
  const q = await quote(t);
  if (q) quotes[t] = q;
  else if (prev.quotes?.[t]) { quotes[t] = { ...prev.quotes[t], stale: true }; console.warn(`${t}: dernier cours conservé`); }
  else console.warn(`${t}: introuvable`);
}

// Taux de change : combien d'unités de devise pour 1 €
const fx = { ...(prev.fx || {}) };
for (const cur of ["USD", "GBP", "CHF", "CAD", "JPY"]) {
  const q = await quote(`EUR${cur}=X`);
  if (q) fx[cur] = q.price;
}

await writeFile("prices.json", JSON.stringify({ updated: new Date().toISOString(), fx, quotes }, null, 2));
console.log(`${Object.keys(quotes).length}/${tickers.length} cours, EUR/USD ${fx.USD}`);
