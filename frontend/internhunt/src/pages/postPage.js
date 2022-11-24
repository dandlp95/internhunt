import React, { useState, useEffect } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import { getApiRoot } from "../utils/getApiRoot";
import Comment from "../components/comment";
import Post from "../components/post";
import InputInterface from "../components/inputInterface";
import { isAuth } from "../utils/isLoggedIn";
import FetchCalls from "../utils/fetchCalls";
import Header from "../components/header";
import "./PostPage.css";

// Need to add handling for when I get back a 200 but nothing was found, although map would probably take care of this...
const PostPage = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const postId = urlParams.get("postId");

  const [post, setPost] = useState();
  const [postUser, setPostuser] = useState(null);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState();
  const [sort, setSort] = useState(); // This will be used to add functionality to sort comments later.
  const [fetchComments, setFetchComments] = useState(true);
  const [commentsLenght, setCommentsLength] = useState(10);
  const navigate = useNavigate();

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
    const options = {
      method: "GET",
      headers: { "Content-type": "application/json" },
    };

    const deletedUser = {};
    deletedUser.firstName = "[Deleted user]";

    const unexistentPost = {};
    unexistentPost.title = "Bad request title";
    unexistentPost.content = "Bad content";

    const getPost = async () => {
      const response = await fetch(
        getApiRoot() + "/posts/getById/" + postId,
        options
      );
      if (response.ok) {
        const foundPost = await response.json();
        setPost(foundPost);

        const userId = foundPost.owner;

        const response2 = await fetch(
          getApiRoot() + "/users/getById/" + userId
        );

        if (response2.ok) {
          const foundUser = await response2.json();
          setPostuser(foundUser);
        } else {
          setPostuser(deletedUser);
        }
      } else {
        setPost(unexistentPost);
        setPostuser(deletedUser);
      }
    };
    getPost();
  }, []);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: { "Content-type": "application/json" },
    };

    const getComments = async () => {
      const response = await fetch(
        getApiRoot() + "/comments/getByPost/" + postId,
        options
      );
      if (response.ok) {
        const commentList = await response.json();
        setComments(commentList);

        console.log("comment list len ", commentList.length);
        setCommentsLength(commentList.length);
      } else {
        setComments([]);
      }
    };
    getComments();
  }, [postId, fetchComments]);

  const postComment = async (comment) => {
    const userData = localStorage.getItem("userData");
    const userDataJSON = JSON.parse(userData);
    const token = userDataJSON.jwt;

    const body = {
      content: comment,
      owner: userDataJSON.userId,
      post: postId,
    };

    const ReqClass = new FetchCalls("/comments/add", "POST", token, body);
    const response = await ReqClass.protectedBody();

    if (response.ok) {
      setFetchComments(!fetchComments); // Makes useEffect fetch comments again
    } else {
      alert("Error");
    }
  };

  const editContent = async (route, id, bodyContent) => {
    const body = {
      content: bodyContent,
    };
    let userData = localStorage.getItem("userData");
    userData = JSON.parse(userData);
    const fetchCall = new FetchCalls(
      `/${route}/edit/${id}`,
      "PATCH",
      userData.jwt,
      body
    );
    const response = await fetchCall.protectedBody();
    if (response.ok) {
      const responseJson = await response.json();
      setPost(responseJson);
    }
  };

  const deleteContent = async (route, id, isRedirect) => {
    let userData = localStorage.getItem("userData");
    userData = JSON.parse(userData);
    const fetchCall = new FetchCalls(
      `/${route}/delete/${id}`,
      "DELETE",
      userData.jwt
    );
    const response = await fetchCall.protectedNoBody();
    if (response.ok) {
      if (isRedirect) {
        navigate(`/posts?major=${encodeURI(userData.major)}`);
      }
    } else {
      alert("error deleting the post");
    }
  };

  if (postUser && post && comments) {
    return (
      <div className="post-page-main">
        <Header accountId={user} />
        <div className="main-grid-container">
          <div></div>
          <div className="grid-column-2">
            <Post
              user={postUser}
              post={post}
              editAction={editContent}
              deleteAction={deleteContent}
              commentsNumber={commentsLenght}
              key={commentsLenght}
            />
            <div className="comment-section-container">
              <InputInterface
                placeholder="What are your thoughts?"
                action={postComment}
                buttonText="Comment"
              />
              {comments.map((comment) => (
                <div>
                  <Comment comment={comment} key={comment._id} />
                  <hr />
                </div>
              ))}
            </div>
          </div>
          <div></div>
        </div>
      </div>
    );
  }
};

export default PostPage;
