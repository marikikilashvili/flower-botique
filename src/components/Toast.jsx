import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Toast() {
  const { toast, dismissToast } = useCart();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(dismissToast, 2600);
    return () => clearTimeout(timer);
  }, [toast, dismissToast]);

  if (!toast) return null;

  return (
    <div className="toast" role="status" key={toast.id}>
      <span className="toast__icon" aria-hidden="true">
        ✓
      </span>
      <p className="toast__message">{toast.message}</p>
      <Link to="/cart" className="toast__link" onClick={dismissToast}>
        View
      </Link>
      <button type="button" className="toast__close" aria-label="Dismiss" onClick={dismissToast}>
        ×
      </button>
    </div>
  );
}
