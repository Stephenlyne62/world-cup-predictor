import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="wc-nav">
      <div className="wc-nav-inner">
        <Link href="/" className="wc-brand" aria-label="World Cup Predictor home">
          <span className="wc-brand-icon">🏆</span>
          <span>
            <span className="wc-brand-title">World Cup Predictor</span>
            <span className="wc-brand-subtitle">indie score club</span>
          </span>
        </Link>

        <div className="wc-links" aria-label="Main navigation">
          <Link href="/fixtures" className="wc-link">Fixtures</Link>
          <Link href="/outrights" className="wc-link">Outrights</Link>
          <Link href="/rules" className="wc-link">Rules</Link>
          <Link href="/login" className="wc-link">Login</Link>
          <Link href="/admin" className="wc-link wc-link-admin">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
