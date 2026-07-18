import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [devToken, setDevToken] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await forgotPassword(email);
      setSent(true);
      // The backend has no email provider configured for this school project,
      // so it returns the token directly for the demo flow. In production
      // this token would only ever be delivered via a real email.
      if (res.data.dev_reset_token) {
        setDevToken(res.data.dev_reset_token);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-shell panel">
        <span className="eyebrow">Account Recovery</span>
        <h2>Forgot password</h2>

        {error && <div className="form-error">{error}</div>}

        {!sent ? (
          <>
            <p>Enter your account email and we'll generate a reset link.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="form-success">
            If that email exists, a reset link has been generated.
            {devToken && (
              <>
                <p style={{ marginTop: 12 }}>
                  This project has no email provider configured yet, so here's your
                  reset link directly (in production this would be emailed instead):
                </p>
                <Link className="btn btn-secondary" to={`/reset-password/${devToken}`}>
                  Go to reset password →
                </Link>
              </>
            )}
          </div>
        )}

        <p className="auth-footer-link"><Link to="/login">Back to log in</Link></p>
      </div>
    </div>
  );
}
