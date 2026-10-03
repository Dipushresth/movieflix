import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

import "../assets/css/login.css";

function Login() {
  const loginMutation = useLogin();
  const { isPending: loading, error } = loginMutation;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    console.log("target name", e.target);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
    console.log("Form submitted with data:", formData);
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <div className="login-logo">MOVIEFLIX</div>

          <h1>Welcome Back</h1>

          <p>Sign in to continue watching your favorite movies.</p>
        </div>

        {error && <div className="login-error">{error.message}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="login-field">
            <div className="login-label-row">
              <label htmlFor="password">Password</label>
            </div>

            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <span>Don't have an account?</span>

          <Link to="/register">Create an account</Link>
        </div>
      </section>
    </main>
  );
}

export default Login;
