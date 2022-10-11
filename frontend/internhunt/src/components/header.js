import React, { useEffect, useState } from "react";
import { getApiRoot } from "../utils/getApiRoot";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";

const Header = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    
    navigate()

  }, []);

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
          <button>Search</button>
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
