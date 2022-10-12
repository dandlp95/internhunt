import React from "react";
import "./login.css";
import { useState, useEffect } from "react";
import { getApiRoot } from "../utils/getApiRoot";
import Background from "../components/background";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import "./login.css";
import FailMessage from "../components/failMessage";

function Login() {
  const [userToken, setUserToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fail, setFail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = async () => {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        return;
      }
      const userDataJson = JSON.parse(userData);
      const token = userDataJson.jwt;
      if (!token) {
        return;
      }
      const options = {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        getApiRoot() + "/users/isAuthorized",
        options
      );

      if (response.ok) {
        const userMajor = userDataJson.major;
        const URLQuery = `?major=${encodeURI(userMajor)}`;
        navigate(`/posts${URLQuery}`);
      }
    };
    isLoggedIn();
  }, []);

  const handleLogin = async () => {
    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    };

    const response = await fetch(getApiRoot() + "/users/login", options);

    if (response.ok) {
      const userData = await response.json();

      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: userData.userId,
          jwt: userData.token,
          major: userData.major,
        })
      );

      const userMajor = userData.major;
      const URLQuery = `?major=${encodeURI(userMajor)}`;
      navigate(`/posts${URLQuery}`);
    } else {
      setFail(true);
    }
  };
  return (
    <div className="loginComponent">
      <form onSubmit={(e) => e.preventDefault()}>
        <h2>Log in into your account</h2>
        <label>
          Enter email:
          <input
            type="text"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Enter password:
          <input
            type="text"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <input type="submit" value="Submit" onClick={handleLogin} />
        <p>
          Don't have an account? <Link to={`/`}>Register here.</Link>
        </p>
        {fail ? <FailMessage action="log in" /> : <p></p>}
      </form>
    </div>
  );
}

export default Login;
