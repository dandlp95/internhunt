import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import { getApiRoot } from "../utils/getApiRoot";
import Comment from "../components/comment";
import Post from "../components/post";
import InputInterface from "../components/inputInterface";
import { isAuth } from "../utils/isLoggedIn";
import FetchCalls from "../utils/fetchCalls";
import Header from "../components/header";

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
      } else {
        setComments([]);
      }
    };
    getComments();
  }, [comments]);

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
      setComments(comments);
    } else {
      alert("Error");
    }
  };

  const editPost = async (editPost) => {
    const body = {
      content: editPost,
    };
    let userData = localStorage.getItem("userData");
    userData = JSON.parse(userData);
    const fetchCall = new FetchCalls(
      `/posts/edit/${post._id}`,
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

  const deletePost = async () => {
    let userData = localStorage.getItem("userData");
    userData = JSON.parse(userData);
    const fetchCall = new FetchCalls(
      `/posts/delete/${post._id}`,
      "DELETE",
      userData.jwt
    );
    const response = await fetchCall.protectedNoBody();
    if (response.ok) {
      alert("Post was deleted");
      navigate(`/posts?major=${encodeURI(userData.major)}`);
    } else {
      alert("error deleting the post");
    }
  };

  if (postUser && post && comments) {
    return (
      <div>
        <Header accountId={user} />
        <Post
          user={postUser}
          post={post}
          editAction={editPost}
          deleteAction={deletePost}
        />
        <InputInterface
          placeholder="What are your thoughts?"
          action={postComment}
          buttonText="Comment"
        />
        {comments.map((comment) => (
          <Comment comment={comment} />
        ))}
      </div>
    );
  }
};

export default PostPage;
