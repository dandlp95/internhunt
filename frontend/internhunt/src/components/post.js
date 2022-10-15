import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import { isAuth } from "../utils/isLoggedIn";
import Button from "./button";

const Post = (props) => {
  const [isPostCreator, setIsPostCreator] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [postEdit, setPostEdit] = useState("");
  const route = "posts";

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
    setEditMode(true);
  };

  const handleEditClick = () => {
    setEditMode(false);
    props.editAction(route, props.post._id, postEdit);
  };

  const handleDeleteClick = () => {
    props.deleteAction(route, props.post._id, true);
  };

  if (!editMode) {
    return (
      <div>
        <p>Posted by {props.user.firstName}</p>
        <section>
          <h2>{props.post.title}</h2>
          <p>{props.post.content}</p>
        </section>
        <div>
          {isPostCreator ? (
            <div>
              <Button text="Edit" action={activateEdit} />
              <Button text="Delete" action={handleDeleteClick} />
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <p>Posted by {props.user.firstName}</p>
        <section>
          <h2>{props.post.title}</h2>
          <input
            type="text"
            value={postEdit}
            onChange={(e) => setPostEdit(e.target.value)}
          />
        </section>
        <div>
          {isPostCreator ? (
            <Button text="Save" action={handleEditClick} />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  }
};

export default Post;

// Extra functionality
// Add a cancel button when they are editing something
