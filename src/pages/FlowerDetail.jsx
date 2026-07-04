import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchFlowerById } from "../api/flowerApi";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";

export default function FlowerDetail() {
  const { id } = useParams();
  const [flower, setFlower] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const { addItem, favorites, toggleFavorite } = useCart();

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchFlowerById(id)
      .then((data) => {
        if (!cancelled) {
          setFlower(data);
          setStatus("success");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setStatus("error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") return <section className="section"><Loader label="Opening its profile…" /></section>;
  if (status === "error")
    return (
      <section className="section">
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      </section>
    );

  const isFavorite = favorites.includes(flower.id);

  return (
    <section className="section detail">
      <Link to="/shop" className="detail__back">
        ← Back to shop
      </Link>
      <div className="detail__grid">
        <div className="detail__media">
          {flower.image ? <img src={flower.image} alt={flower.name} /> : <div className="flower-card__placeholder">✿</div>}
        </div>
        <div className="detail__content">
          <p className="modal__eyebrow">{flower.family || "Bloomery selection"}</p>
          <h1>{flower.name}</h1>
          {flower.scientificName && <p className="modal__latin">{flower.scientificName}</p>}
          <p className="modal__description">{flower.description}</p>

          <ul className="modal__facts">
            {flower.cycle && (
              <li>
                <strong>Cycle</strong>
                {flower.cycle}
              </li>
            )}
            {flower.watering && (
              <li>
                <strong>Watering</strong>
                {flower.watering}
              </li>
            )}
            {flower.sunlight?.length > 0 && (
              <li>
                <strong>Sunlight</strong>
                {flower.sunlight.join(", ")}
              </li>
            )}
            {flower.attracts?.length > 0 && (
              <li>
                <strong>Attracts</strong>
                {flower.attracts.join(", ")}
              </li>
            )}
            {flower.origin?.length > 0 && (
              <li>
                <strong>Origin</strong>
                {flower.origin.join(", ")}
              </li>
            )}
          </ul>

          <div className="modal__actions">
            <span className="flower-card__price">${flower.price}</span>
            <button type="button" className="btn btn--primary" onClick={() => addItem(flower)}>
              Add to cart
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => toggleFavorite(flower.id)}>
              {isFavorite ? "♥ Favorited" : "♡ Favorite"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
