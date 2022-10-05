import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import { getApiRoot } from "../utils/getApiRoot";

const Post = (props) => {
  const [post, setPost] = useState();
  const [user, setUser] = useState();
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get("postId");

    const getProduct = async () => {
      const options = {
        method: "GET",
        headers: { "Content-type": "application/json" },
      };
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
          const foundUser = response2.json();
          setUser(foundUser);
        } else {
          setUser("[User Deleted]");
        }

        setPost(foundPost);
      } else {
        console.log(response);
        // do something
      }
    };
  }, []);
  return (
    <div>
      <p>
        Posted by {user.firstName} {user.lastName}
      </p>
      <section>
        <h2>{props.title}</h2>
        <p>{props.content}</p>
      </section>
    </div>
  );
};

export default Post;
