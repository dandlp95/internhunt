import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import { getApiRoot } from "../utils/getApiRoot";

const Comment = (props) => {
  const [commentUser, setCommentUser] = useState("");
  useEffect(() => {
    const getUserInfo = async () => {
      const commentUserId = props.comment.owner;
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

  return (
    <div>
      <div>
        <p>{commentUser.firstName}</p>
      </div>
      <div>
        <p>{props.comment.content}</p>
      </div>
    </div>
  );
};

export default Comment;
