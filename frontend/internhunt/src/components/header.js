import React, { useEffect, useState } from "react";
import { getApiRoot } from "../utils/getApiRoot";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";

const Header = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const userData = localStorage.getItem("userData");
  const userDataJson = JSON.parse(userData);

  const searchPost = () => {
    props.action(
      `/posts?major=${encodeURI(userDataJson.major)}&search=${encodeURI(
        searchQuery
      )}`
    );
  };
  // The img tag will link them to all the posts.
  return (
    <div>
      <header>
        <div>
          <Link to={`/posts?major=${encodeURI(userDataJson.major)}`}>
          <img /> 
          <p>Img placehodler</p>
          </Link>
        </div>
        <div>
          <Link to={`/about`}>
            <p>About</p>
          </Link>
        </div>
        <div>
          <Link to={`/guidelines`}>
            <p>Community Guidelines</p>
          </Link>
        </div>
        <div>
          <input type="text" onChange={(e) => setSearchQuery(e.target.value)} />
          <button onClick={searchPost}>Search</button>
        </div>
        <div>
          <Link to={`/account-portal/?accountId=${props.accountId}`}>
            <p>Account</p>
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Header;
