import "./Loading.scss";
export default function Loading() {
  return (
    <div
      className="loader__wrap"
      role="alertdialog"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading…"
    >
      <div className="loader" aria-hidden="true">
        <div>
          <div className="loader__sq" />
          <div className="loader__sq" />
        </div>
        <div className="loadingText">Now Loading...</div>
      </div>
    </div>
  );
}
