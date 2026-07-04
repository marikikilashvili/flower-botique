import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQty, totalPrice } = useCart();

  return (
    <>
      <div className={`drawer-backdrop ${open ? "is-open" : ""}`} onClick={onClose} />
      <aside className={`drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="drawer__header">
          <h2>Your bouquet</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="drawer__empty">
            <p>Your bouquet is empty.</p>
            <Link to="/shop" onClick={onClose} className="btn btn--primary">
              Browse flowers
            </Link>
          </div>
        ) : (
          <>
            <ul className="drawer__list">
              {items.map((item) => (
                <li key={item.id} className="drawer__item">
                  {item.image ? <img src={item.image} alt={item.name} /> : <div className="flower-card__placeholder">✿</div>}
                  <div className="drawer__item-info">
                    <p className="drawer__item-name">{item.name}</p>
                    <p className="drawer__item-price">${item.price} each</p>
                    <div className="drawer__qty">
                      <button type="button" onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease quantity">
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase quantity">
                        +
                      </button>
                    </div>
                  </div>
                  <button type="button" className="drawer__remove" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="drawer__footer">
              <div className="drawer__total">
                <span>Total</span>
                <strong>${totalPrice.toFixed(2)}</strong>
              </div>
              <Link to="/cart" onClick={onClose} className="btn btn--primary btn--block">
                View bouquet
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
