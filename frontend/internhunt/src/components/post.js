import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import { getApiRoot } from "../utils/getApiRoot";
import Comment from "./comment";

const Post = () => {
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get("postId");

    const options = {
      method: "GET",
      headers: { "Content-type": "application/json" },
    };

    const getPost = async () => {
      const response = await fetch(
        getApiRoot() + "/posts/getById/" + productId,
        options
      );

      if (response.ok) {
        const foundPost = await response.json();
        const userId = foundPost.owner;

        const response2 = await fetch(
          getApiRoot() + "/users/getById/" + userId
        );

        if (response2.ok) {
          const foundUser = await response2.json();
          setUser(foundUser);
        } else {
          const deletedUser = {};
          deletedUser.firstName = "[Deleted ";
          deletedUser.lastName = "user]";
          setUser(deletedUser);
        }

        setPost(foundPost);
      } else {
        const unexistentPost = {};
        unexistentPost.title = "Bad request title";
        unexistentPost.content = "Bad content";
        setPost(unexistentPost);

        const deletedUser = {};
        deletedUser.firstName = "[Deleted ";
        deletedUser.lastName = "user]";
        setUser(deletedUser);
      }
    };

    const getComments = async () => {
      const response = await fetch(
        getApiRoot() + "/comments/getByPost/" + productId,
        options
      );
      if (response.ok) {
        const commentList = response.json();
        setComments(commentList);
      }
    };

    getPost();
  }, []);

  if (post && user) {
    return (
      <div>
        This is the post page
        <p>
          Posted by {user.firstName} {user.lastName}
        </p>
        <section>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </section>
      </div>
    );
  }
};

export default Post;
