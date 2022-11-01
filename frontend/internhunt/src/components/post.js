import React from "react";
import { useState, useEffect } from "react";
import { isAuth } from "../utils/isLoggedIn";
import VotingInterface from "./votingInterface";
import getLocalStorage from "../utils/getLocalStorage";
import FetchCalls from "../utils/fetchCalls";
import Button from "./button";

const Post = (props) => {
  const [isPostCreator, setIsPostCreator] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [postEdit, setPostEdit] = useState("");
  const [voteCount, setVoteCount] = useState(props.post.rating);
  const [rerenderChild, setRerenderChild] = useState(true);
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
        console.log();
      }
    }
    setRerenderChild(!rerenderChild);
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
        <VotingInterface
          voteCount={voteCount}
          addVoteHandler={addVotePost}
          postInfo={props.post}
          key={rerenderChild}
        />
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
        <VotingInterface
          voteCount={voteCount}
          addVoteHandler={addVotePost}
          postInfo={props.post}
          key={rerenderChild}
        />
      </div>
    );
  }
};

export default Post;

// Extra functionality
// Add a cancel button when they are editing something
