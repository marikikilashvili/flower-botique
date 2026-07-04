export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <p className="footer__brand">✿ Bloomery</p>
          <p className="footer__tag">Flowers, styled — a small botanical studio.</p>
        </div>
        <p className="footer__meta">
          Flower data &amp; imagery courtesy of the{" "}
          <a href="https://perenual.com/docs/api" target="_blank" rel="noreferrer">
            Perenual API
          </a>
          . Built for a university front-end assignment.
        </p>
      </div>
    </footer>
  );
}
