import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
        const user = await response.json();
        if (comment.owner) {
          if (user._id === comment.owner._id) {
            setIsCommentCreator(true);
          } else {
            setIsCommentCreator(false);
          }
        } else {
          setIsCommentCreator(false);
        }
      }
    };
    isCommentCreator();

    if (comment.owner) {
      setCommentUser(`${comment.owner.firstName} ${comment.owner.lastName}`);
    } else {
      setCommentUser("[Deleted user]");
    }
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
    if (userVote === 1) {
      voteReq = "upvote";
    } else if (userVote === -1) {
      voteReq = "downvote";
    }

    const data = getLocalStorage("userData");
    if (!data) {
      console.log("no local storage data :(");
    } else {
      const caller = new FetchCalls(
        `/posts/vote/${voteReq}/${comment._id}`,
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

  const deleteContent = async () => {
    let userData = localStorage.getItem("userData");
    userData = JSON.parse(userData);
    const fetchCall = new FetchCalls(
      `/${route}/delete/${comment._id}`,
      "DELETE",
      userData.jwt
    );
    const response = await fetchCall.protectedNoBody();
    if (!response.ok) {
      alert("error deleting the post");
    } else {
      setComment();
    }
  };

  if (comment) {
    if (!editMode) {
      return (
        <div className="comment-main">
          <div className="flexbox-1">
            <VotingInterface
              voteCount={voteCount}
              addVoteHandler={addVotePost}
              postInfo={comment}
              key={rerenderChild}
            />
          </div>
          <div className="flexbox-2">
            <div>
              <div className="comment-owner-data">
                {comment.owner ? (
                  <Link to={`/account-portal/${comment.owner._id}`}>
                    {commentUser}
                  </Link>
                ) : (
                  <div>{commentUser}</div>
                )}
              </div>
              <div className="comment-content-div">
                <p>{comment.content}</p>
              </div>
            </div>

            <div className="comment-edit-delete-div">
              {isCommentCreator && (
                <div className="button-flexbox">
                  <button onClick={(e) => activateEdit()}>Edit</button>
                  <button onClick={(e) => deleteContent()}>Delete</button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="comment-main">
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
            {isCommentCreator && (
              <Button text="Save" action={handleEditClick} />
            )}
          </div>
          <VotingInterface
            voteCount={voteCount}
            addVoteHandler={addVotePost}
            postInfo={comment}
            key={rerenderChild}
          />
        </div>
      );
    }
  }
};

export default Comment;
