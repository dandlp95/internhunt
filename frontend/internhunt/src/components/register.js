import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import styles from "./App";
import { getApiRoot } from "./utils/getApiRoot";

const RegisterComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [major, setMajor] = useState("");
  const [majorsList, setMajorsList] = useState("");

  useEffect(() => {
    const getMajors = async () => {
      const options = {
        method: "POST",
        headers: { "Content-type": "application/json" },
      };
      const response = await fetch(getApiRoot() + "/majors", options);
      const majors = await response.json();
      setMajorsList(majors);
    };
    getMajors();
  }, []); // Use this use effect to get a list of majors and add it to the drop down menu

  const handleRegister = async () => {
    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName, major }),
    };

    const response = await fetch(getApiRoot() + "/users/add", options);
    const jsonResponse = await response.json();
  };

  return (
    <div>
      <form>
        <label>
          Enter email:
          <input
            type="text"
            name="email"
            onChance={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <input
            type="text"
            name="password"
            onChance={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          <input
            type="text"
            name="firstName"
            onChance={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label>
          <input
            type="text"
            name="lastName"
            onChance={(e) => setLastName(e.target.value)}
          />
        </label>
        <select>
          <option value="Default">- Select -</option>
          {majorsList.map((major) => (
            <option value={major._id}>{major.name}</option>
          ))}
        </select>
      </form>
    </div>
  );
};
