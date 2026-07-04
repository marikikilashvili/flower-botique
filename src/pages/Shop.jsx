import { useEffect, useMemo, useRef, useState } from "react";
import { useFlowers } from "../hooks/useFlowers";
import FlowerCard from "../components/FlowerCard";
import FlowerModal from "../components/FlowerModal";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";

const SORTS = {
  featured: () => 0,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "name-asc": (a, b) => a.name.localeCompare(b.name),
};

export default function Shop() {
  const { flowers, status, error, hasMore, loadingMore, loadMore, refetch } = useFlowers();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [quickView, setQuickView] = useState(null);
  const sentinelRef = useRef(null);

  const visible = useMemo(() => {
    const filtered = flowers.filter((f) =>
      f.name.toLowerCase().includes(query.trim().toLowerCase())
    );
    return [...filtered].sort(SORTS[sort]);
  }, [flowers, query, sort]);

  // Infinite scroll: pull in the next catalog page when the sentinel below the
  // grid comes within 400px of the viewport.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || status !== "success" || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [status, hasMore, loadMore]);

  return (
    <section className="section shop">
      <div className="shop__header">
        <div>
          <p className="hero__eyebrow">The full collection</p>
          <h1 className="shop__title">Shop the catalog</h1>
        </div>

        <div className="shop__controls">
          <input
            type="search"
            placeholder="Search flowers…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search flowers"
          />
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort flowers">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name-asc">Name: A–Z</option>
          </select>
        </div>
      </div>

      {status === "loading" && <Loader />}
      {status === "error" && <ErrorState error={error} onRetry={refetch} />}
      {status === "success" && visible.length === 0 && (
        <div className="error-state">
          <div className="error-state__icon">✿</div>
          <h3>No blooms match "{query}"</h3>
          <p>Try a different search term.</p>
        </div>
      )}
      {status === "success" && visible.length > 0 && (
        <div className="flower-grid">
          {visible.map((flower, i) => (
            <FlowerCard key={flower.id} flower={flower} index={i} onQuickView={setQuickView} />
          ))}
        </div>
      )}

      {status === "success" && (
        <div className="shop__footer" ref={sentinelRef}>
          {loadingMore && <Loader label="Gathering more blooms…" />}
          {!hasMore && !loadingMore && (
            <p className="shop__end">✿ That's every bloom in the collection</p>
          )}
        </div>
      )}

      <FlowerModal flower={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}
