import React from "react";
import PostPreview from "../components/postPreview";
import Header from "../components/header";
import Footer from "../components/footer";
import { useState, useEffect } from "react";
import { getApiRoot } from "../utils/getApiRoot";
import { Link, useNavigate } from "react-router-dom";
import { isAuth } from "../utils/isLoggedIn";
import { useLocation } from "react-router-dom";
import "./posts.css";
import i from "../assets/i.png";
import { MdWorkOff } from "react-icons/md"; // Internship opportunities icon
import { FaHandsHelping } from "react-icons/fa"; // advise
import { GiHelp } from "react-icons/gi"; // questions
import { VscOpenPreview } from "react-icons/vsc"; // all posts
import { MdRateReview } from "react-icons/md"; // review

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState();
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
        const info = await res.json();
        console.log("info ", info);
        setUser(info);
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
    console.log("all was clicked");
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
    if (sortBy === "date") {
      sortedPosts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    } else if (sortBy === "popularity") {
      sortedPosts.sort((a, b) => a.rating - b.rating);
    }
    setPosts(sortedPosts);
  }, [sortBy]);

  if (user) {
    return (
      <div className="posts-page">
        <Header accountId={user._id} />
        <div className="main">
          <div className="posts-main">
            <div className="sortPostsDiv">
              <div>
                <button onClick={(e) => setSortBy("popularity")}>
                  Popular
                </button>
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
                    <Link to={"/majors"}>
                      <button>Majors</button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="posts-div">
                <div className="posts-container">
                  <div className="create-post-container">
                    <div className="create-post">
                      <div>
                        <img src={i} width="55px" />
                        <Link to={`/create-post`}>
                          <input placeholder="Create post" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="posts-queries">
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
                        onClick={(e) =>
                          getPostByType("Internship opportunities")
                        }
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
                  </div>
                  {posts.map((post) => (
                    <div className="post-preview-container" key={post._id}>
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
  }
};

export default Posts;
