import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFlowers } from "../hooks/useFlowers";
import FlowerCard from "../components/FlowerCard";
import FlowerModal from "../components/FlowerModal";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";

export default function Home() {
  const { flowers, status, error, refetch } = useFlowers();
  const [quickView, setQuickView] = useState(null);

  const featured = useMemo(() => flowers.slice(0, 4), [flowers]);

  return (
    <>
      <section className="hero">
        <div className="hero__text">
          <p className="hero__eyebrow">A small botanical studio</p>
          <h1>
            Flowers,
            <br />
            <em>styled.</em>
          </h1>
          <p className="hero__lead">
            Bloomery curates real species from growers' records into a boutique catalog —
            every bloom paired with its botanical story, not just a price tag.
          </p>
          <div className="hero__actions">
            <Link to="/shop" className="btn btn--primary btn--large">
              Explore the shop
            </Link>
            <Link to="/about" className="btn btn--ghost btn--large">
              Our story
            </Link>
          </div>
        </div>
        <div className="hero__bouquet" aria-hidden="true">
          <div className="hero__blob hero__blob--one" />
          <div className="hero__blob hero__blob--two" />
          <div className="hero__blob hero__blob--three" />
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <h2>This week's picks</h2>
          <Link to="/shop" className="section__link">
            View all →
          </Link>
        </div>

        {status === "loading" && <Loader />}
        {status === "error" && <ErrorState error={error} onRetry={refetch} />}
        {status === "success" && (
          <div className="flower-grid">
            {featured.map((flower, i) => (
              <FlowerCard key={flower.id} flower={flower} index={i} onQuickView={setQuickView} />
            ))}
          </div>
        )}
      </section>

      <section className="promise">
        <div className="promise__item">
          <span>01</span>
          <h3>Sourced with care</h3>
          <p>Every species is drawn from real botanical records — common name, family and growth habit included.</p>
        </div>
        <div className="promise__item">
          <span>02</span>
          <h3>Kept close</h3>
          <p>Your bouquet lives in this browser between visits, so you can pick up right where you left off.</p>
        </div>
        <div className="promise__item">
          <span>03</span>
          <h3>Made to browse</h3>
          <p>Quick-view any bloom without leaving the page, or open its full botanical profile.</p>
        </div>
      </section>

      <FlowerModal flower={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
