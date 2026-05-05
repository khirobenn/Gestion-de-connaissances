import { useState } from "react";
import "./auth.css";

import { supabase } from '../utils/supabase'

type Tab = "signin" | "signup";
function StrengthBar({ password }: { password: string }) {
  const getScore = (v: string): number => {
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    return score;
  };

  const score = getScore(password);
  const colors = ["#1e1e22", "#993c1d", "#c8a96e", "#5dcaa5", "#1d9e75"];
  const labels = ["— strength indicator", "weak", "fair", "good", "strong"];
  const activeColor = password.length === 0 ? "#1e1e22" : colors[score];

  return (
    <>
      <div className="strength">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="strength-bar"
            style={{ background: i < score ? activeColor : "#1e1e22" }}
          />
        ))}
      </div>
      <div
        className="strength-label"
        style={{ color: password.length === 0 ? "#555" : activeColor }}
      >
        {labels[password.length === 0 ? 0 : score]}
      </div>
    </>
  );
}

function SignInForm({ onSwitch, setAccess }: { onSwitch: () => void, setAccess:any}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    async function getTodos() {
        const { error: err } = await supabase.auth.signInWithPassword({
          email:email,
          password:password
        })

        if (err) {
          console.log("Erreur de se connecter hhhhh tu fais le malin")
        }
        else{
          console.log("login with success")
          setAccess(true)
        }
      };
    getTodos()
  };

  return (
    <>
      <div className="dot-row">
        <div className="dot" />
        <span className="page-title">Welcome back</span>
      </div>
      <div className="card">
        <div className="field">
          <label htmlFor="signin-email">Email address</label>
          <input
            id="signin-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="signin-password">Password</label>
          <input
            id="signin-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="forgot">Forgot password?</span>
        </div>
        <div className="divider" />
        <button className="btn-primary" onClick={handleSubmit}>Sign In →</button>
        <div className="or-row">
          <span>or</span>
        </div>
        <p className="helper">
          No account?{" "}
          <span className="link" onClick={onSwitch}>
            Create one
          </span>
        </p>
      </div>
    </>
  );
}

function SignUpForm({ onSwitch, setAccess }: { onSwitch: () => void, setAccess:any}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [erreur, setErreur] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  const handleSubmit = () => {
    async function getTodos() {
        const { error: err } = await supabase.auth.signUp({
          email:email,
          password:password,
          options: {
            data:{
              firstName : firstName,
              lastName : lastName
            }
          }
        })

        if (err) {
          setErreur(true)
        }
        else{
          setSignedUp(true)
        }
      };
    getTodos()
  };

  return (
    <>
      <div className="dot-row">
        <div className="dot" />
        <span className="page-title">Create account</span>
      </div>
      <div className="card">
        <div className="name-row">
          <div className="field">
            <label htmlFor="signup-first">First name</label>
            <input
              id="signup-first"
              type="text"
              placeholder="Jane"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="signup-last">Last name</label>
            <input
              id="signup-last"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <StrengthBar password={password} />
        </div>

        <div className="field">
          <label htmlFor="signup-confirm">Confirm password</label>
          <input
            id="signup-confirm"
            type="password"
            placeholder="Repeat your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <div className="check-row">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>
            I agree to the <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>
          </span>
        </div>

        <div className="divider" />
        {erreur && <p style={{color:"red"}}>Email already used or weak password !</p>}
        {signedUp && <p style={{color:"green"}}>Please check your email to confirm new account !</p>}
        <button className="btn-primary" onClick={handleSubmit}>Create Account →</button>
        <p className="helper">
          Already have an account?{" "}
          <span className="link" onClick={onSwitch}>
            Sign in
          </span>
        </p>
      </div>
    </>
  );
}

export default function AuthPage({ setAccess } : { setAccess : any }) {
  const [tab, setTab] = useState<Tab>("signin");

  return (
    <div className="auth-shell">
      <div className="tabs">
        <button
          className={`tab ${tab === "signin" ? "active" : ""}`}
          onClick={() => setTab("signin")}
        >
          Sign In
        </button>
        <button
          className={`tab ${tab === "signup" ? "active" : ""}`}
          onClick={() => setTab("signup")}
        >
          Create Account
        </button>
      </div>

      <div className="auth-page">
        {tab === "signin" ? (
          <SignInForm onSwitch={() => setTab("signup")} setAccess={setAccess} />
        ) : (
          <SignUpForm onSwitch={() => setTab("signin")} setAccess={setAccess}/>
        )}
      </div>
    </div>
  );
}