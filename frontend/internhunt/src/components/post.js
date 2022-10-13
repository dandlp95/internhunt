import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import { getApiRoot } from "../utils/getApiRoot";
import Comment from "./comment";
import { isAuth } from "../utils/isLoggedIn";
import Button from "./button";

const Post = (props) => {
  const [isPostCreator, setIsPostCreator] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const isPostCreator = async () => {
      const response = await isAuth();
      if (response.ok) {
        const userId = await response.json();
        if (userId === props.user._id) {
          setIsPostCreator(true);
        } else {
          setIsPostCreator(false);
        }
      }
    };
    isPostCreator();
  }, []);

  const activateEdit = () => {
    setEditMode(true)
  };

  return (
    <div>
      <p>Posted by {props.user.firstName}</p>
      <section>
        <h2>{props.post.title}</h2>
        
        <p>{props.post.content}</p>
      </section>
      <div>
        {isPostCreator ? (
          <Button value="Edit" action={activateEdit} />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Post;
