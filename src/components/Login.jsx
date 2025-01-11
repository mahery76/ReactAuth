import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const LOGIN_URL = "/auth";

function Login() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setErrorMessage("");
  }, [user, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, password }),
        {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ user, password, roles, accessToken });
      setUser("");
      setPassword("");
      navigate(from, { replace: true });
      // replace: indicating that the navigation should replace the current history entry instead of adding a new one
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No server response");
      } else if (err.response?.status === 400) {
        setErrorMessage("Missing username or password");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized");
      } else {
        setErrorMessage("Login failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <section>
      <p
        ref={errRef}
        className={errorMessage ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errorMessage}
      </p>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          required
        />
        <br />
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          id="pasword"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </form>
      <p>
        Need an account? <br />
        <span className="line">
          \<Link to="/register">Sign up</Link>
        </span>
      </p>
    </section>
  );
}

export default Login;
