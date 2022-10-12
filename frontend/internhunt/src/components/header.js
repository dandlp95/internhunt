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

  return (
    <div>
      <header>
        <div>
          <img />
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
