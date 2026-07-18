import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container not-found">
      <div className="stat-value">404</div>
      <h2>Page not found</h2>
      <p>That page doesn't exist, or you followed a broken link.</p>
      <Link to="/" className="btn btn-primary">Back to Catalog</Link>
    </div>
  );
}
