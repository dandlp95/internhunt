import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuth } from "../utils/isLoggedIn";
import VotingInterface from "./votingInterface";
import getLocalStorage from "../utils/getLocalStorage";
import FetchCalls from "../utils/fetchCalls";
import Button from "./button";
import { timeDifference } from "../utils/timeDifference";
import { BiDotsHorizontalRounded } from "react-icons/bi";

const Post = (props) => {
  const [isPostCreator, setIsPostCreator] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [postEdit, setPostEdit] = useState("");
  const [voteCount, setVoteCount] = useState(props.post.rating);
  const [rerenderChild, setRerenderChild] = useState(true);
  const [displayOwnerOptions, setDisplayOwnerOptions] = useState(false);
  const route = "posts";
  const timeDiff = timeDifference(new Date(), new Date(props.post.date));

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
        `/posts/vote/${voteReq}/${props.post._id}`,
        "PATCH",
        data.jwt,
        { rating: userVote }
      );
      const response = await caller.protectedBody();
      if (response.ok) {
        setVoteCount(voteCount + userVote);
      } else {
      }
    }
    setRerenderChild(!rerenderChild);
  };

  const checkIsPostCreator = async () => {
    const response = await isAuth();
    if (response.ok) {
      const user = await response.json();
      if (user._id === props.user._id) {
        setIsPostCreator(true);
      } else {
        setIsPostCreator(false);
      }
    }
  };

  useEffect(() => {
    checkIsPostCreator();
  }, []);

  if (!editMode) {
    return (
      <div className="post-main">
        <div className="flex-box-1">
          <VotingInterface
            voteCount={voteCount}
            addVoteHandler={addVotePost}
            postInfo={props.post}
            key={rerenderChild}
          />
        </div>
        <div className="flex-box-2">
          <p className="posted-by-section">
            Posted by{" "}
            <Link to={`/account-portal/${props.user._id}`}>
              {props.user.firstName}
            </Link>{" "}
            {timeDiff}
          </p>
          <section className="post-section">
            <h2>{props.post.title}</h2>
            <p>{props.post.content}</p>
          </section>
          <div>
            {props.commentsNumber === 1 ? (
              <div>{`${props.commentsNumber} comment`}</div>
            ) : (
              <div>{`${props.commentsNumber} comments`}</div>
            )}
            {isPostCreator && (
              <div className="owner-options-container">
                <div className="owner-options-dots">
                  <BiDotsHorizontalRounded
                    onClick={(e) =>
                      setDisplayOwnerOptions(!displayOwnerOptions)
                    }
                  />
                </div>
                {displayOwnerOptions && (
                  <div className="post-owner-options">
                    <div onClick={(e) => activateEdit()}>Edit</div>
                    <div onClick={(e) => handleDeleteClick()}>Delete</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="post-main">
        <div className="flex-box-1">
          <VotingInterface
            voteCount={voteCount}
            addVoteHandler={addVotePost}
            postInfo={props.post}
            key={rerenderChild}
          />
        </div>
        <div className="flex-box-2">
          <p className="posted-by-section">
            Posted by{" "}
            <Link to={`/account-portal/${props.user._id}`}>
              {props.user.firstName}
            </Link>{" "}
            {timeDiff}
          </p>
          <section className="post-section">
            <h2>{props.post.title}</h2>
            <input
              type="text"
              value={postEdit}
              onChange={(e) => setPostEdit(e.target.value)}
            />
          </section>
          <div>
            {isPostCreator && <Button text="Save" action={handleEditClick} />}
          </div>
        </div>
      </div>
    );
  }
};

export default Post;

// Extra functionality
// Add a cancel button when they are editing something
