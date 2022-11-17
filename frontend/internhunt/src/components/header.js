import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import logo5 from "../assets/Internhunt-7.png"

const Header = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const userData = localStorage.getItem("userData");
  const userDataJson = JSON.parse(userData);
  const navigate = useNavigate();

  const searchPost = () => {
    navigate(
      `/posts?major=${encodeURI(userDataJson.major)}&search=${encodeURI(
        searchQuery
      )}`
    );
  };

  const isKeyEntered = (e) => {
    if (!e) e = window.event;
    var keyCode = e.code || e.key;
    if (keyCode == "Enter") {
      searchPost();
    }
  };

  const handleSignout = (e) => {
    console.log("clicked");
    localStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <div className="header-component">
      <header>
        <div className="headerflex logo">
          <Link to={`/posts?major=${encodeURI(userDataJson.major)}`}>
            <img src={logo5} alt="transparent-logo" width="200px"/>
          </Link>
        </div>
        <div className="headerflex header-about">
          <Link to={`/about`}>
            <p>About</p>
          </Link>
        </div>
        <div className="headerflex header-guidelines">
          <Link to={`/guidelines`}>
            <p>Community Guidelines</p>
          </Link>
        </div>
        <div className="headerflex searchBar">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => isKeyEntered(e)}
            placeholder="  Search..."
          />
        </div>
        <div className="headerflex header-account">
          <Link to={`/account-portal/${props.accountId}`}>
            <p>Account</p>
          </Link>
        </div>
        <div className="sign-out-div">
          <button onClick={(e) => handleSignout(e)}>Sign out</button>
        </div>
      </header>
    </div>
  );
};

export default Header;
