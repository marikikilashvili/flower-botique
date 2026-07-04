import { useEffect, useRef, useState, useCallback } from "react";
import { fetchFlowerPage } from "../api/flowerApi";

/**
 * Loads the flower catalog one page (batch of search terms) at a time.
 * Exposes loadMore() + hasMore for infinite scroll, plus a refetch() escape
 * hatch for the error view's retry button.
 */
export function useFlowers() {
  const [flowers, setFlowers] = useState([]);
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sampleMode, setSampleMode] = useState(false);

  const pageRef = useRef(0);
  const seenIdsRef = useRef(new Set());
  const busyRef = useRef(false);

  const loadPage = useCallback(async (page) => {
    const { flowers: batch, hasMore: more, sample } = await fetchFlowerPage(page);
    const fresh = batch.filter((f) => !seenIdsRef.current.has(f.id));
    fresh.forEach((f) => seenIdsRef.current.add(f.id));
    setFlowers((prev) => [...prev, ...fresh]);
    setHasMore(more);
    setSampleMode(Boolean(sample));
    pageRef.current = page + 1;
  }, []);

  const load = useCallback(async () => {
    busyRef.current = true;
    setStatus("loading");
    setError(null);
    setFlowers([]);
    setHasMore(true);
    seenIdsRef.current = new Set();
    pageRef.current = 0;
    try {
      await loadPage(0);
      setStatus("success");
    } catch (err) {
      setError(err);
      setStatus("error");
    } finally {
      busyRef.current = false;
    }
  }, [loadPage]);

  const loadMore = useCallback(async () => {
    if (busyRef.current || status !== "success" || !hasMore) return;
    busyRef.current = true;
    setLoadingMore(true);
    try {
      await loadPage(pageRef.current);
    } catch {
      // A failed "load more" (e.g. rate limit) shouldn't blank the already-loaded
      // catalog — stop paginating and keep what we have.
      setHasMore(false);
    } finally {
      setLoadingMore(false);
      busyRef.current = false;
    }
  }, [loadPage, status, hasMore]);

  useEffect(() => {
    load();
  }, [load]);

  return { flowers, status, error, hasMore, loadingMore, loadMore, sampleMode, refetch: load };
}
