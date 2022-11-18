import React from "react";
import PostPreview from "../components/postPreview";
import Header from "../components/header";
import Footer from "../components/footer";
import Button from "../components/button";
import { useState, useEffect } from "react";
import { getApiRoot } from "../utils/getApiRoot";
import { Link, useNavigate } from "react-router-dom";
import { isAuth } from "../utils/isLoggedIn";
import { useLocation } from "react-router-dom";
import "./posts.css";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
  const [rerenderChild, setRerenderChild] = useState(true);
  const [sortBy, setSortBy] = useState("");
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
    console.log("location rerendered");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const major = urlParams.get("major");
    const search = urlParams.get("search");
    const type = urlParams.get("type");

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

  useEffect(() => {
    var sortedPosts = [...posts];
    if (sortBy == "date") {
      console.log("date");
      sortedPosts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    } else if (sortBy == "popularity") {
      console.log("popularity");
      sortedPosts.sort((a, b) => a.rating - b.rating);
    }
    console.log(sortedPosts === posts);
    setPosts(sortedPosts);
  }, [sortBy]);

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
          </div>
          <div className="sortPostsDiv">
            <div>
              <button onClick={(e) => setSortBy("popularity")}>Popular</button>
            </div>
            <div>
              <button onClick={(e) => setSortBy("date")}>New</button>
            </div>
            <div></div>
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
                  <div className="post-preview-container">
                    <PostPreview post={post} key={post._id}/>
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
