import { useCart } from "../context/CartContext";

export default function FlowerCard({ flower, onQuickView, index = 0 }) {
  const { addItem, favorites, toggleFavorite } = useCart();
  const isFavorite = favorites.includes(flower.id);

  return (
    <article className="flower-card" style={{ "--stagger": index % 8 }}>
      <button
        type="button"
        className="flower-card__favorite"
        aria-pressed={isFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={() => toggleFavorite(flower.id)}
      >
        {isFavorite ? "♥" : "♡"}
      </button>

      <button type="button" className="flower-card__frame" onClick={() => onQuickView(flower)}>
        {flower.image ? (
          <img src={flower.image} alt={flower.name} loading="lazy" />
        ) : (
          <div className="flower-card__placeholder">✿</div>
        )}
      </button>

      <div className="flower-card__body">
        <h3>{flower.name}</h3>
        {flower.scientificName && <p className="flower-card__latin">{flower.scientificName}</p>}
        <div className="flower-card__row">
          <span className="flower-card__price">${flower.price}</span>
          <button type="button" className="btn btn--small" onClick={() => addItem(flower)}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
