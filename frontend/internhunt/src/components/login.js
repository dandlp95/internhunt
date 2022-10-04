import React from "react";
import "./login.css";
import { useState, useEffect } from "react";
import { getApiRoot } from "../utils/getApiRoot";
import Background from "./background";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import "./login.css";
import FailMessage from "./failMessage";

function Login() {
  const [userToken, setUserToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fail, setFail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // This next couple of lines are for testing:
    // const tokenValue =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlbDE3MDExQGJ5dWkuZWR1IiwiaWQiOiI2MzMyNTlmZjliNjk0ZDg0YmU3MDE3YWIiLCJpYXQiOjE2NjQ4NDQ2NzMsImV4cCI6MTY2NDg0ODI3M30.g7J0HW37DJ2FlSD1CGNmB-kyxtWiv4e-9hbZCMOBLq8";
    // localStorage.setItem("userData", JSON.stringify({ token: tokenValue, major: "Geology" }));

    const isLoggedIn = async () => {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        return;
      }
      const userDataJson = JSON.parse(userData);
      const token = userDataJson.token;
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
        navigate("/posts");
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
