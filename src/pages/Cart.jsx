import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <section className="section cart-empty">
        <div className="error-state">
          <div className="error-state__icon">✿</div>
          <h3>Your bouquet is empty</h3>
          <p>Add a few blooms from the shop to build your arrangement.</p>
          <Link to="/shop" className="btn btn--primary">
            Browse flowers
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section cart-page">
      <h1 className="shop__title">Your bouquet</h1>
      <div className="cart-page__grid">
        <ul className="cart-page__list">
          {items.map((item) => (
            <li key={item.id} className="cart-page__item">
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
              <div className="cart-page__item-total">${(item.qty * item.price).toFixed(2)}</div>
              <button type="button" className="drawer__remove" onClick={() => removeItem(item.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>

        <aside className="cart-page__summary">
          <h2>Order summary</h2>
          <div className="cart-page__summary-row">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="cart-page__summary-row">
            <span>Arrangement &amp; delivery</span>
            <span>$0.00</span>
          </div>
          <div className="cart-page__summary-row cart-page__summary-row--total">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="btn btn--primary btn--block">
            Proceed to checkout
          </Link>
          <button type="button" className="btn btn--ghost btn--block" onClick={clearCart}>
            Clear bouquet
          </button>
        </aside>
      </div>
    </section>
  );
}
