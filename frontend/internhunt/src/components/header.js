import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";

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

  return (
    <div className="header-component">
      <header>
        <div className="logo">
          <Link to={`/posts?major=${encodeURI(userDataJson.major)}`}>
            <p>Img placehodler</p>
          </Link>
        </div>
        <div className="header-about">
          <Link to={`/about`}>
            <p>About</p>
          </Link>
        </div>
        <div className="header-guidelines">
          <Link to={`/guidelines`}>
            <p>Community Guidelines</p>
          </Link>
        </div>
        <div className="searchBar">
          <input
            type="search"
            
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => isKeyEntered(e)}
            placeholder="  Search..."
          />
        </div>
        <div className="header-account">
          <Link to={`/account-portal/${props.accountId}`}>
            <p>Account</p>
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Header;
