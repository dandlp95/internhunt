import React from "react";
import { useState, useEffect } from "react";
import { getApiRoot } from "../utils/getApiRoot";
import { isAuth } from "../utils/isLoggedIn";
import Button from "./button";
import FetchCalls from "../utils/fetchCalls";
import getLocalStorage from "../utils/getLocalStorage";
import VotingInterface from "./votingInterface";

const Comment = (props) => {
  const [commentUser, setCommentUser] = useState("");
  const [isCommentCreator, setIsCommentCreator] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [commentEdit, setCommentEdit] = useState("");
  const [comment, setComment] = useState(props.comment);
  const [voteCount, setVoteCount] = useState(props.comment.rating);
  const [rerenderChild, setRerenderChild] = useState(true);

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

  const addVotePost = async (userVote) => {
    var voteReq;
    if (userVote == 1) {
      voteReq = "upvote";
    } else if (userVote == -1) {
      voteReq = "downvote";
    }

    const data = getLocalStorage("userData");
    if (!data) {
      console.log("no local storage data :(");
    } else {
      const caller = new FetchCalls(
        `/posts/vote/${voteReq}/${props.comment._id}`,
        "PATCH",
        data.jwt,
        { rating: userVote }
      );
      const response = await caller.protectedBody();
      if (response.ok) {
        setVoteCount(voteCount + userVote);
      } else {
        console.log();
      }
    }
    setRerenderChild(!rerenderChild);
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
        <VotingInterface
          voteCount={voteCount}
          addVoteHandler={addVotePost}
          postInfo={props.comment}
          key={rerenderChild}
        />
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
        <VotingInterface
          voteCount={voteCount}
          addVoteHandler={addVotePost}
          postInfo={props.comment}
          key={rerenderChild}
        />
      </div>
    );
  }
};

export default Comment;
