import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import { getApiRoot } from "../utils/getApiRoot";

const Comment = (props) => {
  const [commentUser, setCommentUser] = useState();
  useEffect(() => {
    const getUserInfo = async () => {
      const commentUserId = props.comment.owner;
      const options = {
        method: "GET",
        headers: { "Content-type": "application/json" },
      };
      const response = await fetch(
        getApiRoot() + "/users/getById/" + commentUserId
      );
      if (response.ok) {
        const responseJson = await response.json();
        setCommentUser(responseJson);
      } else {
        const noResponse = {};
        noResponse.firstName = "No";
        noResponse.lastName = "username";
        setCommentUser(noResponse)
      }
    };
  }, []);
  return (
    <div>
        <p>This is a comment</p>
      <div>
        <p>
          {commentUser.firstName} {commentUser.lastName}
        </p>
      </div>
      <div>
        <p>{props.comment.content}</p>
      </div>
    </div>
  );
};

export default Comment