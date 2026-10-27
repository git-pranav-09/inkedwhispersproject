// Hidden field that humans never fill in. Bots that do are silently discarded.
export default function Honeypot() {
  return (
    <div className="hp" aria-hidden="true">
      <label htmlFor="hp-website">Website</label>
      <input id="hp-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
