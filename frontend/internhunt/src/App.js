import React from "react";
import { useState, useEffect } from "react";
import { getApiRoot } from "./utils/getApiRoot";
import "./App.css";
import Background from "./components/background";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [major, setMajor] = useState("");
  const [majorsList, setMajorsList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
        headers: { "Content-type": "application/json" },
      };
      const response = await fetch(getApiRoot() + "/users/isAuthorized");
      if (response.ok) {
        navigate("/posts");
      }
    };
  });

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
    const jsonResponse = await response.json();

    if (response.ok) {
      // logic after they have registered.
    } else {
      // logic if the backend response was not correct.
    }
  };

  return (
    <div className="registrationPage">
      <div class="registration-container">
        <div className="pageInfo">
          <section className="pageInfoSection">
            <h2>Internhunt</h2>
            <ul>
              <li>Internhunt information here</li>
              <li>Internhunt information </li>
              <li>Internhunt information </li>
              <li>Internhunt information </li>
            </ul>
          </section>
        </div>
        <div className="formDiv">
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
            <p>
              Already have an account? <Link to={`/login`}>Click here.</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
