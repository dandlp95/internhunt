import React from "react";
import { useState, useEffect } from "react";
import { getApiRoot } from "./utils/getApiRoot";
import "./App.css";
//import Background from "./components/background";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import FailMessage from "./components/failMessage";
import { isAuth } from "../src/utils/isLoggedIn";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [major, setMajor] = useState("");
  const [majorsList, setMajorsList] = useState([]);
  const [fail, setFail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = async () => {
      const response = await isAuth();
      if (response.ok) {
        const userData = localStorage.getItem("userData");
        const userDataJson = JSON.parse(userData);
        const major = userDataJson.major;
        const urlQuery = `?major=${encodeURI(major)}`;
        navigate(`/posts${urlQuery}`);
      }
    };
    isLoggedIn();
  }, []);

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

    if (response.ok) {
      const jsonResponse = await response.json();
      localStorage.setItem("userData", JSON.stringify(jsonResponse));
      const userMajor = jsonResponse.major;

      navigate(`/posts/${userMajor}`);
    } else {
      setFail(true);
    }
  };

  return (
    <div className="registrationPage">
      <div className="registration-container">
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
            <label>Enter email:</label>
            <input
              type="text"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Enter password:</label>
            <input
              type="text"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Enter first name:</label>
            <input
              type="text"
              name="firstName"
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
            />

            <label>Enter last name:</label>
            <input
              type="text"
              name="lastName"
              onChange={(e) => setLastName(e.target.value)}
            />

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
            {fail ? <FailMessage action="register" /> : <p></p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
