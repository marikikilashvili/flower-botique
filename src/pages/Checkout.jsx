import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Demo checkout only — nothing is sent anywhere. Card fields are formatted and
// validated client-side, then the "payment" is simulated with a short delay.

const formatCardNumber = (value) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const EMPTY_FORM = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  postal: "",
  country: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Enter your full name.";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email address.";
  if (!form.address.trim()) errors.address = "Enter a delivery address.";
  if (!form.city.trim()) errors.city = "Enter a city.";
  if (!form.postal.trim()) errors.postal = "Enter a postal code.";
  if (!form.country.trim()) errors.country = "Enter a country.";
  if (!form.cardName.trim()) errors.cardName = "Enter the name on the card.";
  if (form.cardNumber.replace(/\s/g, "").length !== 16)
    errors.cardNumber = "Card number must be 16 digits.";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) errors.expiry = "Use MM/YY format.";
  if (!/^\d{3,4}$/.test(form.cvc)) errors.cvc = "3 or 4 digits.";
  return errors;
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("filling"); // 'filling' | 'processing' | 'done'
  const [orderNumber, setOrderNumber] = useState(null);

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setStatus("processing");
    // Simulate the payment round-trip, then confirm and empty the bouquet.
    setTimeout(() => {
      setOrderNumber(`BLM-${Math.floor(100000 + Math.random() * 900000)}`);
      setStatus("done");
      clearCart();
    }, 1500);
  };

  if (status === "done") {
    return (
      <section className="section cart-empty">
        <div className="error-state">
          <div className="error-state__icon">✿</div>
          <h3>Your bouquet is on its way</h3>
          <p>
            Order <strong>{orderNumber}</strong> is confirmed — a Bloomery florist will begin
            arranging it shortly. A receipt was "sent" to {form.email}.
          </p>
          <Link to="/shop" className="btn btn--primary">
            Keep browsing
          </Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="section cart-empty">
        <div className="error-state">
          <div className="error-state__icon">✿</div>
          <h3>Nothing to check out</h3>
          <p>Your bouquet is empty — add a few blooms first.</p>
          <Link to="/shop" className="btn btn--primary">
            Browse flowers
          </Link>
        </div>
      </section>
    );
  }

  const field = (name, label, props = {}, format) => (
    <label className={`field${errors[name] ? " field--error" : ""}`}>
      <span className="field__label">{label}</span>
      <input
        {...props}
        value={form[name]}
        onChange={(e) => setField(name, format ? format(e.target.value) : e.target.value)}
        aria-invalid={Boolean(errors[name])}
      />
      {errors[name] && <span className="field__message">{errors[name]}</span>}
    </label>
  );

  return (
    <section className="section checkout">
      <h1 className="shop__title">Checkout</h1>
      <p className="checkout__demo-note">
        This is a demo checkout — no payment is processed and nothing you type leaves your
        browser. Please don't enter a real card number.
      </p>

      <div className="checkout__grid">
        <form className="checkout__form" onSubmit={handleSubmit} noValidate>
          <fieldset className="checkout__fieldset">
            <legend>Delivery details</legend>
            {field("fullName", "Full name", { autoComplete: "name", placeholder: "Rosa Bloom" })}
            {field("email", "Email", {
              type: "email",
              autoComplete: "email",
              placeholder: "rosa@example.com",
            })}
            {field("address", "Street address", {
              autoComplete: "street-address",
              placeholder: "12 Petal Lane",
            })}
            <div className="checkout__row">
              {field("city", "City", { autoComplete: "address-level2", placeholder: "Florence" })}
              {field("postal", "Postal code", { autoComplete: "postal-code", placeholder: "50100" })}
            </div>
            {field("country", "Country", { autoComplete: "country-name", placeholder: "Italy" })}
          </fieldset>

          <fieldset className="checkout__fieldset">
            <legend>Payment</legend>
            {field("cardName", "Name on card", {
              autoComplete: "cc-name",
              placeholder: "ROSA BLOOM",
            })}
            {field(
              "cardNumber",
              "Card number",
              {
                inputMode: "numeric",
                autoComplete: "cc-number",
                placeholder: "4242 4242 4242 4242",
              },
              formatCardNumber
            )}
            <div className="checkout__row">
              {field(
                "expiry",
                "Expiry (MM/YY)",
                { inputMode: "numeric", autoComplete: "cc-exp", placeholder: "08/29" },
                formatExpiry
              )}
              {field(
                "cvc",
                "CVC",
                { inputMode: "numeric", autoComplete: "cc-csc", placeholder: "123", maxLength: 4 },
                (v) => v.replace(/\D/g, "").slice(0, 4)
              )}
            </div>
          </fieldset>

          <button
            type="submit"
            className="btn btn--primary btn--block"
            disabled={status === "processing"}
          >
            {status === "processing" ? "Processing payment…" : `Pay $${totalPrice.toFixed(2)}`}
          </button>
        </form>

        <aside className="cart-page__summary">
          <h2>Your bouquet</h2>
          <ul className="checkout__items">
            {items.map((item) => (
              <li key={item.id} className="checkout__item">
                {item.image ? (
                  <img src={item.image} alt="" />
                ) : (
                  <div className="flower-card__placeholder">✿</div>
                )}
                <span className="checkout__item-name">
                  {item.name} × {item.qty}
                </span>
                <span>${(item.qty * item.price).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="cart-page__summary-row">
            <span>Arrangement &amp; delivery</span>
            <span>$0.00</span>
          </div>
          <div className="cart-page__summary-row cart-page__summary-row--total">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <Link to="/cart" className="btn btn--ghost btn--block">
            Edit bouquet
          </Link>
        </aside>
      </div>
    </section>
  );
}
