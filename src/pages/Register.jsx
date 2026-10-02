import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { AuthLayout } from "./Login";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/dashboard", { replace: true });
    });
    return unsubscribe;
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Could not create the account. The email may already be registered.");
    } finally {
      setLoading(false);
    }
  };

  return <AuthLayout title="Create your account" subtitle="Start keeping your expenses organized.">
    <form onSubmit={handleSubmit}>
      <label>Email<input className="auth-input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <label>Password<input className="auth-input" type="password" autoComplete="new-password" minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="auth-btn" disabled={loading}>{loading ? "Creating account…" : "Create account"}</button>
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </form>
  </AuthLayout>;
}
export default Register;
