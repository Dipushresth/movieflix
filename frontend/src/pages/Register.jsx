import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useRegister } from "../hooks/useRegister";

import "../assets/css/auth.css";

function Register() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [success, setSuccess] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("");
    registerMutation.mutate(formData, {
      onSuccess: () => {
        setSuccess("Registration successful!");

        setFormData({
          name: "",
          email: "",
          password: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      },
    });
  };

  const loading = registerMutation.isPending;
  const error = registerMutation.error
    ? registerMutation.error.message || "Registration failed"
    : "";

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">MOVIEFLIX</div>

          <h1>Create Account</h1>

          <p>Create your account and start watching movies.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {success && <div className="auth-success">{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="name">Name</label>

            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="name"
              required
            />
          </div>

          <div className="auth-field">
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

          <div className="auth-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>

          <Link to="/login">Login</Link>
        </div>
      </section>
    </main>
  );
}

export default Register;
