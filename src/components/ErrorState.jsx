const MESSAGES = {
  MISSING_KEY: {
    title: "No API key configured",
    body: "Add a free Perenual API key to your .env file as VITE_PERENUAL_API_KEY and restart the dev server.",
  },
  RATE_LIMITED: {
    title: "The garden needs a rest",
    body: "We've hit the Perenual API's free-tier limit of 100 requests per day. Already-loaded blooms are kept in your browser — the full catalog will be back tomorrow.",
  },
};

export default function ErrorState({ error, onRetry }) {
  const known = MESSAGES[error?.code];
  return (
    <div className="error-state" role="alert">
      <div className="error-state__icon">✿</div>
      <h3>{known ? known.title : "The blooms didn't load"}</h3>
      <p>
        {known
          ? known.body
          : error?.message || "Something interrupted the connection to the flower catalog. Please try again."}
      </p>
      {onRetry && (
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
