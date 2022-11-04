import React from "react";
import PostPreview from "../components/postPreview";
import InputInterface from "../components/inputInterface";
import Header from "../components/header";
import Footer from "../components/footer";
import Button from "../components/button";
import { useState, useEffect } from "react";
import { getApiRoot } from "../utils/getApiRoot";
import { Link, useNavigate } from "react-router-dom";
import { isAuth } from "../utils/isLoggedIn";
import { useLocation } from "react-router-dom";
import "./posts.css";
import FetchCalls from "../utils/fetchCalls";
import getLocalStorage from "../utils/getLocalStorage";

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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const major = urlParams.get("major");
    const search = urlParams.get("search");
    const type = urlParams.get("type");
    console.log(type);

    const getPosts = async () => {
      const options = {
        method: "GET",
        headers: { "Content-type": "application/json" },
      };

      const URIQuery = `search=${search}&major=${major}&type=${type}`;

      const response = await fetch(
        getApiRoot() + "/posts/getPosts?" + encodeURI(URIQuery),
        options
      );

      if (response.ok) {
        const foundPosts = await response.json();
        setPosts(foundPosts);
      } else {
        console.log("something failed", response);
      }
    };
    getPosts();
  }, [location]);

  const getPostByType = async (postType) => {
    const userData = localStorage.getItem("userData");
    const userDataJson = JSON.parse(userData);
    if (postType !== "all") {
      navigate(
        `/posts?major=${encodeURI(userDataJson.major)}&type=${postType}`
      );
    } else {
      navigate(`/posts?major=${encodeURI(userDataJson.major)}`);
    }
  };

  useEffect(() => {}, []); // There will be a third use effect to sort data from new to old, etc...

  return (
    <div>
      <Header accountId={user} />
      <div className="main">
        <div className="posts-main">
          <div className="create-post">
            <div></div>

            <div className="create-post-input">
              <Link to={`/create-post`}>
                <input placeholder="Create post" />
              </Link>
            </div>

            <Button text="Filter" action="filter function here" />
          </div>

          <div className="posts-query">
            <div>
              <div className="query">
                <div>
                  <button onClick={(e) => getPostByType("all")}>
                    All Posts
                  </button>
                </div>
                <div>
                  <button onClick={(e) => getPostByType("Review")}>
                    Internship Reviews
                  </button>
                </div>
                <div>
                  <button
                    onClick={(e) => getPostByType("Internship opportunities")}
                  >
                    Internship Opportunities
                  </button>
                </div>
                <div>
                  <button onClick={(e) => getPostByType("Advise")}>
                    Advise
                  </button>
                </div>
                <div>
                  <button onClick={(e) => getPostByType("Question")}>
                    Questions
                  </button>
                </div>
                <div>
                  <Link to={"/majors"}>
                    <button>Majors</button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="posts-div">
              <div className="posts-container">
                {posts.map((post) => (
                  <div>
                    <PostPreview post={post} />
                  </div>
                ))}
              </div>
              <div className="pagination"></div>
            </div>

            <div></div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Posts;
