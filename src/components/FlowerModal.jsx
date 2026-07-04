import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchFlowerById } from "../api/flowerApi";
import { useCart } from "../context/CartContext";
import Loader from "./Loader";
import ErrorState from "./ErrorState";

export default function FlowerModal({ flower, onClose }) {
  const [detail, setDetail] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    if (!flower) return;
    let cancelled = false;
    setStatus("loading");
    fetchFlowerById(flower.id)
      .then((data) => {
        if (!cancelled) {
          setDetail(data);
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
  }, [flower]);

  useEffect(() => {
    if (!flower) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [flower, onClose]);

  if (!flower) return null;
  const shown = detail || flower;

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={shown.name}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal__close" aria-label="Close" onClick={onClose}>
          ×
        </button>

        <div className="modal__media">
          {shown.image ? <img src={shown.image} alt={shown.name} /> : <div className="flower-card__placeholder">✿</div>}
        </div>

        <div className="modal__content">
          {status === "loading" && <Loader label="Reading the petals…" />}
          {status === "error" && <ErrorState error={error} />}
          {status !== "loading" && status !== "error" && (
            <>
              <p className="modal__eyebrow">{shown.family || "Bloomery selection"}</p>
              <h2>{shown.name}</h2>
              {shown.scientificName && <p className="modal__latin">{shown.scientificName}</p>}
              <p className="modal__description">{shown.description}</p>

              <ul className="modal__facts">
                {shown.cycle && (
                  <li>
                    <strong>Cycle</strong>
                    {shown.cycle}
                  </li>
                )}
                {shown.watering && (
                  <li>
                    <strong>Watering</strong>
                    {shown.watering}
                  </li>
                )}
                {shown.sunlight?.length > 0 && (
                  <li>
                    <strong>Sunlight</strong>
                    {shown.sunlight.join(", ")}
                  </li>
                )}
                {shown.origin?.length > 0 && (
                  <li>
                    <strong>Origin</strong>
                    {shown.origin.join(", ")}
                  </li>
                )}
              </ul>

              <div className="modal__actions">
                <span className="flower-card__price">${shown.price}</span>
                <button type="button" className="btn btn--primary" onClick={() => addItem(shown)}>
                  Add to cart
                </button>
                <Link to={`/flower/${shown.id}`} className="btn btn--ghost" onClick={onClose}>
                  Full page
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
