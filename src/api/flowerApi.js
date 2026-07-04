import axios from "axios";
import { SAMPLE_FLOWERS, getSampleFlowerById } from "./sampleFlowers";

// Bloomery uses the Perenual botanical API (https://perenual.com/docs/api) as its
// flower data + image source. Perenual's free tier gives 100 requests/day and does not
// support filtering species strictly by "is a flower", so we curate a list of well
// known flower genera/names and query the species-list endpoint for each of them,
// merging + de-duplicating the results client side.
//
// To stay inside the daily quota:
//  - terms are fetched lazily in small batches ("pages") as the user scrolls,
//  - every term's results are cached in localStorage for CACHE_TTL,
//  - when the API rate-limits us (429), stale cached results are served instead.
const BASE_URL = "https://perenual.com/api/v2";
const API_KEY = import.meta.env.VITE_PERENUAL_API_KEY;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
});

// A curated set of search terms that reliably return real flower species from Perenual.
export const FLOWER_SEARCH_TERMS = [
  "rose",
  "tulip",
  "orchid",
  "peony",
  "daisy",
  "lily",
  "sunflower",
  "hibiscus",
  "dahlia",
  "iris",
  "jasmine",
  "lavender",
  "carnation",
  "poppy",
  "hydrangea",
];

// How many search terms make up one catalog "page" for infinite scroll.
const TERMS_PER_PAGE = 3;
export const TOTAL_CATALOG_PAGES = Math.ceil(FLOWER_SEARCH_TERMS.length / TERMS_PER_PAGE);

const CACHE_PREFIX = "bloomery:term:";
const DETAIL_CACHE_PREFIX = "bloomery:detail:";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

// De-duplicates concurrent identical requests (e.g. React StrictMode's double
// effect run in dev) so each term/detail costs at most one API call at a time.
const inFlight = new Map();

function dedupe(key, run) {
  if (inFlight.has(key)) return inFlight.get(key);
  const promise = run().finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}

function assertApiKey() {
  if (!API_KEY) {
    const err = new Error(
      "Missing Perenual API key. Add VITE_PERENUAL_API_KEY to a .env file (see README)."
    );
    err.code = "MISSING_KEY";
    throw err;
  }
}

function isRateLimit(err) {
  return err?.response?.status === 429;
}

function tagError(err) {
  if (isRateLimit(err)) err.code = "RATE_LIMITED";
  return err;
}

function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { savedAt, value } = JSON.parse(raw);
    return { value, fresh: Date.now() - savedAt < CACHE_TTL };
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), value }));
  } catch {
    // Storage full or unavailable — caching is best-effort only.
  }
}

function normalizeSpecies(raw) {
  const img = raw.default_image;
  return {
    id: raw.id,
    name: raw.common_name || (raw.scientific_name && raw.scientific_name[0]) || "Unnamed bloom",
    scientificName: Array.isArray(raw.scientific_name) ? raw.scientific_name[0] : raw.scientific_name,
    family: raw.family || null,
    cycle: raw.cycle || null,
    image:
      img?.regular_url || img?.medium_url || img?.original_url || img?.small_url || img?.thumbnail || null,
    // Perenual has no price/currency field — Bloomery derives a stable "boutique price"
    // from the species id so the same flower always shows the same price.
    price: 18 + ((raw.id * 7) % 62),
  };
}

/** Fetch (or read from cache) the normalized results for a single search term. */
function fetchByTerm(term) {
  const cacheKey = CACHE_PREFIX + term;
  const cached = readCache(cacheKey);
  if (cached?.fresh) return Promise.resolve(cached.value);

  return dedupe(cacheKey, async () => {
    try {
      const { data } = await client.get("/species-list", {
        params: { key: API_KEY, q: term },
      });
      const flowers = (data?.data || [])
        .filter((item) => item.default_image?.regular_url || item.default_image?.medium_url)
        .map(normalizeSpecies);
      writeCache(cacheKey, flowers);
      return flowers;
    } catch (err) {
      // Rate-limited (or offline): serve yesterday's results rather than nothing.
      if (cached) return cached.value;
      throw tagError(err);
    }
  });
}

/**
 * Fetch one catalog page (a batch of curated search terms), merged and de-duplicated.
 * Returns { flowers, hasMore } for infinite scrolling.
 */
export async function fetchFlowerPage(page = 0) {
  assertApiKey();
  const terms = FLOWER_SEARCH_TERMS.slice(page * TERMS_PER_PAGE, (page + 1) * TERMS_PER_PAGE);
  const results = await Promise.allSettled(terms.map((term) => fetchByTerm(term)));

  const merged = new Map();
  let anySucceeded = false;

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      anySucceeded = true;
      result.value.forEach((flower) => {
        if (!merged.has(flower.id)) merged.set(flower.id, flower);
      });
    }
  });

  if (!anySucceeded) {
    // Surface the first real error (e.g. bad key, rate limit) rather than a vague message.
    const firstFailure = results.find((r) => r.status === "rejected");
    const reason = firstFailure ? firstFailure.reason : new Error("Failed to load the flower catalog.");
    // Daily quota exhausted with nothing cached: fall back to the bundled sample
    // catalog (first page only) so the shop stays browsable until the limit resets.
    if (page === 0 && reason.code === "RATE_LIMITED") {
      return { flowers: SAMPLE_FLOWERS, hasMore: false, sample: true };
    }
    throw reason;
  }

  return {
    flowers: Array.from(merged.values()),
    hasMore: page + 1 < TOTAL_CATALOG_PAGES,
  };
}

export function fetchFlowerById(id) {
  // Sample-catalog flowers carry all their detail fields locally — no API call.
  const sample = getSampleFlowerById(id);
  if (sample) return Promise.resolve(sample);

  assertApiKey();
  const cacheKey = DETAIL_CACHE_PREFIX + id;
  const cached = readCache(cacheKey);
  if (cached?.fresh) return Promise.resolve(cached.value);

  return dedupe(cacheKey, async () => {
    try {
      const { data } = await client.get(`/species/details/${id}`, {
        params: { key: API_KEY },
      });
      const detail = {
        ...normalizeSpecies(data),
        description:
          data.description ||
          `The ${data.common_name || "flower"} is prized by growers for its ${
            (data.sunlight && data.sunlight.join(", ")) || "adaptable"
          } growing habits and graceful form. A lovely addition to any curated bouquet.`,
        watering: data.watering || null,
        sunlight: Array.isArray(data.sunlight) ? data.sunlight : [],
        attracts: Array.isArray(data.attracts) ? data.attracts : [],
        origin: Array.isArray(data.origin) ? data.origin : [],
      };
      writeCache(cacheKey, detail);
      return detail;
    } catch (err) {
      if (cached) return cached.value;
      throw tagError(err);
    }
  });
}
