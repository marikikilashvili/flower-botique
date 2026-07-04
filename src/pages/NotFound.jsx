import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section cart-empty">
      <div className="error-state">
        <div className="error-state__icon">✿</div>
        <h3>This bloom wandered off</h3>
        <p>We couldn't find that page.</p>
        <Link to="/" className="btn btn--primary">
          Back to home
        </Link>
      </div>
    </section>
  );
}
