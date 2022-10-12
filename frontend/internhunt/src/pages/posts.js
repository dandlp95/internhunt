import React from "react";
import "./posts.css";
import { useState, useEffect } from "react";
import { getApiRoot } from "../utils/getApiRoot";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import PostPreview from "../components/postPreview";
import InputInterface from "../components/inputInterface";
import Header from "../components/header";
import { isAuth } from "../utils/isLoggedIn";

const Posts = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const major = urlParams.get("major");
  const search = urlParams.get("search");

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState(major);
  const [majorQuery, setMajorQuery] = useState(search);
  const navigate = useNavigate();
  const [test, setTest] = useState();

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
    console.log("this was called");

    const getPosts = async () => {
      const options = {
        method: "GET",
        headers: { "Content-type": "application/json" },
      };

      let URIQuery;
      if (majorQuery && searchQuery) {
        URIQuery = `search=${searchQuery}&major=${majorQuery}`;
      } else if (majorQuery && !searchQuery) {
        URIQuery = `major=${majorQuery}`;
      } else if (!majorQuery && searchQuery) {
        URIQuery = `search=${searchQuery}`;
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
  }, [majorQuery, searchQuery]);

  useEffect(() => {}, []); // There will be a third use effect to sort data from new to old, etc...

  const getUrlQuery = (urlQuery) => {
    navigate(urlQuery);

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const major = urlParams.get("major");
    const search = urlParams.get("search");

    setMajorQuery(major)
    setSearchQuery(search)
  };

  return (
    <div>
      <Header accountId={user} action={getUrlQuery} />
      <div className="make new post and filter...">
        <Link to={`/create-post`}>
          <div>
            <input placeholder="Create post" />
          </div>
        </Link>
      </div>
      <div className="the queries to see other majors and such"></div>
      <div className="The posts and pagination will be on this one.">
        <div className="posts">
          posts here.
          {posts.map((post) => (
            <PostPreview post={post} />
          ))}
        </div>
        <div className="pagination"></div>
      </div>
    </div>
  );
};

export default Posts;
