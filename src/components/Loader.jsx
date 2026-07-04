export default function Loader({ label = "Gathering blooms…" }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader__petals">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <p>{label}</p>
    </div>
  );
}
