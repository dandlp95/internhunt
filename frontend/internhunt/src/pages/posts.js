import React from "react";
import "./posts.css";
import { useState, useEffect } from "react";
import { getApiRoot } from "../utils/getApiRoot";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import PostPreview from "../components/postPreview";
import InputInterface from "../components/inputInterface";
import Header from "../components/header";
import { isAuth } from "../utils/isLoggedIn";
import { useLocation } from "react-router-dom";
import Footer from "../components/footer";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isLoggedIn = async () => {
      const res = await isAuth();
      if (!res.ok) {
        alert("Please log in");
        navigate("/");
      } else {
        const userData = localStorage.getItem("userData");
        const userDataJson = JSON.parse(userData);
        setUser(userDataJson.userId);
      }
    };
    isLoggedIn();
  }, []);

  useEffect(() => {
    console.log("Location changed");

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const major = urlParams.get("major");
    const search = urlParams.get("search");

    const getPosts = async () => {
      const options = {
        method: "GET",
        headers: { "Content-type": "application/json" },
      };

      let URIQuery;
      if (major && search) {
        URIQuery = `search=${search}&major=${major}`;
      } else if (major && !search) {
        URIQuery = `major=${major}`;
      } else if (!major && search) {
        URIQuery = `search=${search}`;
      }

      const response = await fetch(
        getApiRoot() + "/posts/getPosts?" + encodeURI(URIQuery),
        options
      );

      if (response.ok) {
        // do something
        const foundPosts = await response.json();
        setPosts(foundPosts);
      } else {
        // do something
        console.log("something failed", response);
      }
    };
    getPosts();
  }, [location]);

  useEffect(() => {}, []); // There will be a third use effect to sort data from new to old, etc...

  const getUrlQuery = (urlQuery) => {
    navigate(urlQuery);
  };

  return (
    <div>
      <Header accountId={user} action={getUrlQuery} />
      <div className="main">
        <div className="create-post">
          <Link to={`/create-post`}>
            <div>
              <input placeholder="Create post" />
            </div>
          </Link>
          <div className="filter">
            <button>Filter</button>
          </div>
        </div>

        <div>
          <div className="query">
            <div>
              <button>Users</button>
            </div>
            <div>
              <button>Majors</button>
            </div>
          </div>

          <div className="posts-div">
            <div className="posts-container">
              {posts.map((post) => (
                <PostPreview post={post} />
              ))}
            </div>
            <div className="pagination"></div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Posts;
