import React from "react";
import { useState, useEffect } from "react";
import { getApiRoot } from "./utils/getApiRoot";
import "./App.css";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [major, setMajor] = useState("");
  const [majorsList, setMajorsList] = useState([]);

  useEffect(() => {
    const getMajors = async () => {
      const options = {
        method: "GET",
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
    console.log(response);
    const jsonResponse = await response.json();
    console.log(jsonResponse);

    if (response.ok) {
      // logic after they have registered.
    } else {
      // logic if the backend response was not correct.
    }
  };

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
        <label>
          Enter first name:
          <input
            type="text"
            name="firstName"
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label>
          Enter last name:
          <input
            type="text"
            name="lastName"
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <label>Choose a major: </label>
        <input
          type="text"
          list="majors"
          onChange={(e) => {
            setMajor(e.target.value);
          }}
        />
        <datalist id="majors">
          {majorsList.map((major) => (
            <option data-value={major._id} value={major.name} />
          ))}
        </datalist>
        <input type="submit" value="Register" onClick={handleRegister} />
      </form>
    </div>
  );
};

export default App;
