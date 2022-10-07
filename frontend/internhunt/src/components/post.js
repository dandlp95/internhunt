import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import { getApiRoot } from "../utils/getApiRoot";
import Comment from "./comment";

const Post = (props) => {
  return (
    <div>
      This is the post
      <p>Posted by {props.user.firstName}</p>
      <section>
        <h2>{props.post.title}</h2>
        <p>{props.post.content}</p>
      </section>
    </div>
  );
};

export default Post;
