import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import { getApiRoot } from "../utils/getApiRoot";
import Comment from "../components/comment";
import Post from "../components/post";
// Need to add handling for when I get back a 200 but nothing was found, although map would probably take care of this...
const PostPage = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const productId = urlParams.get("postId");

  const [post, setPost] = useState();
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState(productId);

  useEffect(() => {
    //setPostId(productId);

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
        getApiRoot() + "/posts/getById/" + productId,
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
          setUser(foundUser);
        } else {
          setUser(deletedUser);
        }
      } else {
        setPost(unexistentPost);
        setUser(deletedUser);
      }
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
    getPost();
    getComments();
  }, []);

  if (user && post && comments) {
    return (
      <div>
        <Post user={user} post={post} />
        {comments.map((comment) => (
          <Comment comment={comment} />
        ))}
      </div>
    );
  }
};

export default PostPage;
