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
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { GiShinyEntrance } from "react-icons/gi";
import { AiFillFire } from "react-icons/ai";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState();
  const [sortBy, setSortBy] = useState("");
  const [isButton1Active, setIsButton1Active] = useState(true);
  const [isButton2Active, setIsButton2Active] = useState(false);
  const [isButton3Active, setIsButton3Active] = useState(false);
  const [isButton4Active, setIsButton4Active] = useState(false);
  const [isButton5Active, setIsButton5Active] = useState(false);
  const [isdropdownActive, setIsdropdownActive] = useState(false);

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

  const styleActiveButtons = (buttonNumber) => {
    const buttonNumbers = [false, false, false, false, false];
    buttonNumbers[buttonNumber] = true;

    for (let i = 0; i < buttonNumbers.length; i++) {
      if (i === 0) {
        setIsButton1Active(buttonNumbers[i]);
      } else if (i === 1) {
        setIsButton2Active(buttonNumbers[i]);
      } else if (i === 2) {
        setIsButton3Active(buttonNumbers[i]);
      } else if (i === 3) {
        setIsButton4Active(buttonNumbers[i]);
      } else if (i === 4) {
        setIsButton5Active(buttonNumbers[i]);
      }
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
        <div className="posts-main">
          <div></div>
          <div className="posts-container">
            <div className="create-post">
              <img src={i} width="75px" />
              <Link to={`/create-post`}>
                <input placeholder="Create post" />
              </Link>
            </div>
            <div className="posts-queries">
              <div>
                <button
                  className={isButton1Active ? "active-button" : ""}
                  onClick={(e) => {
                    getPostByType("all");
                    styleActiveButtons(0);
                  }}
                >
                  <VscOpenPreview className="icon" /> All Posts
                </button>
              </div>
              <div>
                <button
                  className={isButton2Active ? "active-button" : ""}
                  onClick={(e) => {
                    getPostByType("Review");
                    styleActiveButtons(1);
                  }}
                >
                  <MdRateReview className="icon" />
                  Reviews
                </button>
              </div>
              <div>
                <button
                  className={isButton3Active ? "active-button" : ""}
                  onClick={(e) => {
                    getPostByType("Internship opportunities");
                    styleActiveButtons(2);
                  }}
                >
                  <MdWorkOff className="icon" />
                  Opportunities
                </button>
              </div>
              <div>
                <button
                  className={isButton4Active ? "active-button" : ""}
                  onClick={(e) => {
                    getPostByType("Advise");
                    styleActiveButtons(3);
                  }}
                >
                  <FaHandsHelping className="icon" />
                  Advise
                </button>
              </div>
              <div>
                <button
                  className={isButton5Active ? "active-button" : ""}
                  onClick={(e) => {
                    getPostByType("Question");
                    styleActiveButtons(4);
                  }}
                >
                  <GiHelp className="icon" />
                  Questions
                </button>
              </div>
              <div className="sort-dropdown">
                <BiDotsHorizontalRounded
                  className="dots-icon"
                  onClick={(e) => setIsdropdownActive(!isdropdownActive)}
                />
                {isdropdownActive && (
                  <div className="sort-dropdownOptions">
                    <div>
                      <button
                        onClick={(e) => {
                          setSortBy("popularity");
                        }}
                      >
                        <GiShinyEntrance />
                        Popular
                      </button>
                    </div>
                    <div>
                      <button onClick={(e) => setSortBy("date")}>
                        <AiFillFire />
                        New
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {posts.map((post) => (
              <div className="post-preview-container" key={post._id}>
                <PostPreview post={post} />
              </div>
            ))}
          </div>
          <div className="majors-div">
            <Link to={"/majors"}>
              <button>Majors</button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
};

export default Posts;
