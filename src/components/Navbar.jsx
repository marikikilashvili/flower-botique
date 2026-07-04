import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../hooks/useTheme";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
];

export default function Navbar({ onOpenCart }) {
  const [open, setOpen] = useState(false);
  const { totalCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <span className="navbar__mark">✿</span> Bloomery
        </NavLink>

        <nav className={`navbar__links ${open ? "is-open" : ""}`}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => `navbar__link ${isActive ? "is-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <button
            type="button"
            className="navbar__cart"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="4.5" />
                <path
                  d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path
                  d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <button
            type="button"
            className="navbar__cart"
            onClick={onOpenCart}
            aria-label={`Open cart, ${totalCount} items`}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="21" r="1.4" />
              <circle cx="18" cy="21" r="1.4" />
            </svg>
            {totalCount > 0 && <span className="navbar__badge">{totalCount}</span>}
          </button>
          <button
            type="button"
            className="navbar__burger"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
