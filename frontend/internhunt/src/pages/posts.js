import React from "react";
import PostPreview from "../components/postPreview";
import Header from "../components/header";
import { useState, useEffect } from "react";
import { getApiRoot } from "../utils/getApiRoot";
import { Link, useNavigate } from "react-router-dom";
import { isAuth } from "../utils/isLoggedIn";
import { useLocation } from "react-router-dom";
import { MdWorkOff, MdRateReview } from "react-icons/md";
import { FaHandsHelping } from "react-icons/fa";
import { GiHelp, GiShinyEntrance } from "react-icons/gi";
import { VscOpenPreview } from "react-icons/vsc";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AiFillFire } from "react-icons/ai";
import FetchCalls from "../utils/fetchCalls";
import "./posts.css";
import i from "../assets/plain-logo.png";
import workImg from "../assets/work-meeting2.jpg";
import PaginationPage from "../components/paginationPage";

const MajorsContainer = (props) => {
  const [majors, setMajors] = useState();
  const navigate = useNavigate();

  const getMajors = async () => {
    const userData = localStorage.getItem("userData");
    const jwt = JSON.parse(userData).jwt;
    const apiCaller = new FetchCalls("/majors", "GET", jwt);
    const response = await apiCaller.publicGet();
    if (response.ok) {
      const fetchedMajors = await response.json();
      setMajors(fetchedMajors);
    } else {
      console.log(response);
    }
  };

  const handleMajorClick = (url) => {
    props.styleActiveButton(0);
    navigate(url);
  };

  useEffect(() => {
    getMajors();
  }, []);

  if (majors) {
    return (
      <div className="majors-options">
        {/* <img src={workImg}/> */}
        <h3>Explore other majors</h3>
        <div className="majors-list-container">
          {majors.slice(0, 8).map((major) => (
            <div key={major._id} className="major-option">
              <div
                onClick={(e) => handleMajorClick(`/posts?major=${major.name}`)}
              >
                {major.name}
              </div>
              <div className="major-option-line">
                <hr />
              </div>
            </div>
          ))}
        </div>
        <div className="majors-button-div">
          <button
            onClick={(e) => navigate("/majors")}
            className="majors-button"
          >
            View All Majors
          </button>
        </div>
      </div>
    );
  }
};

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState();
  const [currPage, setCurrPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [isButton1Active, setIsButton1Active] = useState(true);
  const [isButton2Active, setIsButton2Active] = useState(false);
  const [isButton3Active, setIsButton3Active] = useState(false);
  const [isButton4Active, setIsButton4Active] = useState(false);
  const [isButton5Active, setIsButton5Active] = useState(false);
  const [isdropdownActive, setIsdropdownActive] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const getPostByType = async (postType) => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("major");

    if (postType !== "all") {
      navigate(`/posts?major=${encodeURI(myParam)}&type=${postType}`);
    } else {
      navigate(`/posts?major=${encodeURI(myParam)}`);
    }
  };

  const nextpage = (pageNumber) => {
    setCurrPage(pageNumber);
    setPosts([]);

    //getPosts(pageNumber);
  };

  const tenChange = (pageNumber, isposOrneg) => {
    var finalPage;
    if (isposOrneg > 0) {
      finalPage = pageNumber + 10;
    } else {
      finalPage = pageNumber - 10;
    }
    setCurrPage(finalPage);
    setPosts([]);
    //getPosts(finalPage);
  };

  const hundreadChange = (pageNumber, isposOrneg) => {
    var finalPage;
    if (isposOrneg > 0) {
      finalPage = pageNumber + 100;
    } else {
      finalPage = pageNumber - 100;
    }
    setCurrPage(finalPage);
    setPosts([]);
    //getPosts(finalPage);
  };

  const isLoggedIn = async () => {
    const res = await isAuth();
    if (!res.ok) {
      alert("Please log in");
      navigate("/");
    } else {
      const userData = localStorage.getItem("userData");
      const userDataJson = JSON.parse(userData);
      const info = await res.json();
      setUser(info);
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
    isLoggedIn();
  }, []);

  const sortBy = (sortParam) => {
    const urlParams = new URLSearchParams(window.location.search);
    const majorParam = urlParams.get("major");
    const typeParam = urlParams.get("type");

    navigate(
      `/posts?major=${encodeURI(
        majorParam
      )}&type=${typeParam}&sort=${sortParam}`
    );
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const major = urlParams.get("major");
    const search = urlParams.get("search");
    const type = urlParams.get("type");
    const sort = urlParams.get("sort");

    const getPosts = async () => {
      const options = {
        method: "GET",
        headers: { "Content-type": "application/json" },
      };

      const URIQuery = `search=${search}&major=${major}&type=${type}&sort=${sort}&page=${currPage}`;
      const URIQuery2 = `search=${search}&major=${major}&type=${type}`;

      const response = await fetch(
        getApiRoot() + "/posts/getPosts?" + encodeURI(URIQuery),
        options
      );

      const response2 = await fetch(
        getApiRoot() + "/posts/getPostsCount?" + encodeURI(URIQuery2),
        options
      );

      if (response.ok && response2.ok) {
        const foundPosts = await response.json();
        const totalPostsCount = await response2.json();

        setTotalPosts(totalPostsCount.count);
        setPosts(foundPosts);
      } else {
        console.log("something failed", response);
      }
    };
    getPosts();
  }, [location, currPage]);

  useEffect(() => {
    console.log("total posts: ", totalPosts);
    if (totalPosts % 10 === 0) {
      setNumberOfPages(Math.floor(totalPosts / 10));
    } else {
      setNumberOfPages(Math.floor(totalPosts / 10) + 1);
    }
  }, [totalPosts]);

  if (user && posts && totalPosts) {
    return (
      <div className="posts-page">
        <Header accountId={user._id} />
        <div className="spacer">&nbsp;</div>
        <div className="posts-main">
          <div></div>
          <div className="posts-container">
            <div className="create-post">
              <img src={i} width="75px" />
              <div className="input">
                <Link to={`/create-post`}>
                  <input placeholder="Create post" />
                </Link>
              </div>
            </div>
            <div className="posts-queries">
              <div className="first-button">
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
                          sortBy("rating");
                        }}
                      >
                        <GiShinyEntrance />
                        Popular
                      </button>
                    </div>
                    <div>
                      <button onClick={(e) => sortBy("date")}>
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
            <MajorsContainer styleActiveButton={styleActiveButtons} />
          </div>
        </div>
        {totalPosts > 10 && (
          <PaginationPage
            pages={numberOfPages}
            nextPage={nextpage}
            currentPage={currPage}
            hundreadChange={hundreadChange}
            tenChange={tenChange}
          ></PaginationPage>
        )}
      </div>
    );
  }
};

export default Posts;

// just in case...
// useEffect(() => {
//   var postsCopy = [...posts];
//   if (sortBy === "date") {
//     postsCopy.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
//   } else if (sortBy === "popularity") {
//     postsCopy.sort((a, b) => b.rating - a.rating);
//   }
//   setSortedPosts(postsCopy);
// }, [sortBy, posts]);
