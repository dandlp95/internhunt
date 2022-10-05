import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";

const PostPreview = (props) => {
  useEffect(() => {
    console.log(props._id)
  }, []);

  return (
    <Link to={`/post?postid=${props.post._id}`}>
      <section>
        <div>
          <h3>{props.post.title}</h3>
          <p>{props.post.rating}</p>
        </div>
        {/* I am not sure if I want to show content in the preview */}
        <p>{props.post.content}</p>
      </section>
    </Link>
  );
};

export default PostPreview;
