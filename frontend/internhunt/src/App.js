import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import styles from "./App";

function App() {
  const [userToken, setUserToken] = useState("");
  // useEffect(()=>{}) Use useEffect() to check if there is a jwt first

  const handleLogin = () => {};

  if (!userToken) {
    return (
      <div>
        <form>
          <label>
            Enter username:
            <input type="text" name="username" />
          </label>
          <label>
            Enter password:
            <input type="text" name="password" />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default App;
