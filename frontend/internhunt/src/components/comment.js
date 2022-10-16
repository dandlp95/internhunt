import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import { getApiRoot } from "../utils/getApiRoot";
import { isAuth } from "../utils/isLoggedIn";
import Button from "./button";
import FetchCalls from "../utils/fetchCalls";

const Comment = (props) => {
  const [commentUser, setCommentUser] = useState("");
  const [isCommentCreator, setIsCommentCreator] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [commentEdit, setCommentEdit] = useState("");
  const [comment, setComment] = useState(props.comment)

  const route = "comments";

  useEffect(() => {
    const isCommentCreator = async () => {
      const response = await isAuth();
      if (response.ok) {
        const userId = await response.json();
        if (userId === comment.owner) {
          setIsCommentCreator(true);
        } else {
          setIsCommentCreator(false);
        }
      }
    };
    isCommentCreator();
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      const commentUserId = comment.owner;
      const options = {
        method: "GET",
        headers: { "Content-type": "application/json" },
      };
      const response = await fetch(
        getApiRoot() + "/users/getById/" + commentUserId,
        options
      );
      if (response.ok) {
        const responseJson = await response.json();
        setCommentUser(responseJson);
      } else {
        const noResponse = {};
        noResponse.firstName = "[Deleted user]";
        setCommentUser(noResponse);
      }
    };
    getUserInfo();
  }, []);

  const activateEdit = () => {
    setEditMode(true);
  };

  const handleEditClick = async () => {
    setEditMode(false);
    const body = {
      content: commentEdit,
    };
    let userData = localStorage.getItem("userData");
    userData = JSON.parse(userData);
    const fetchCall = new FetchCalls(
      `/comments/edit/${comment._id}`,
      "PATCH",
      userData.jwt,
      body
    );
    const response = await fetchCall.protectedBody();
    if (response.ok) {
      const responseJson = await response.json();
      setComment(responseJson);
    }
  };

  const handleDeleteClick = () => {
    props.deleteAction(route, comment._id, false);
  };

  if (!editMode) {
    return (
      <div>
        <div>
          <p>{commentUser.firstName}</p>
        </div>
        <div>
          <p>{comment.content}</p>
        </div>
        <div>
          {isCommentCreator ? (
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
        <div>
          <p>{commentUser.firstName}</p>
        </div>
        <div>
          <input
            type="text"
            value={commentEdit}
            onChange={(e) => setCommentEdit(e.target.value)}
          />
        </div>
        <div>
          {isCommentCreator ? (
            <Button text="Save" action={handleEditClick} />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  }
};

export default Comment;
