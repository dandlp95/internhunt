import React from "react";
import "./login.css";
import { useState, useEffect } from "react";
import { getApiRoot } from "./utils/getApiRoot";

function Login() {
  const [userToken, setUserToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // useEffect(()=>{}) Use useEffect() to check if there is a jwt first

  const handleLogin = async () => {
    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    };

    const response = await fetch(getApiRoot() + "/users/login", options);
    const userData = await response.json();
    console.log(userData);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: userData.userId,
        jwt: userData.token,
        major: userData.major,
      })
    );
  };

  if (!userToken) {
    return (
      <div>
        <form onSubmit={(e) => e.preventDefault()}>
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
        </form>
      </div>
    );
  }
}

export default Login;
