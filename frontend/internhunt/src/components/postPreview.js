import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import VotingInterface from "./votingInterface";
import getLocalStorage from "../utils/getLocalStorage";
import FetchCalls from "../utils/fetchCalls";

const PostPreview = (props) => {
  const [voteCount, setVoteCount] = useState(props.post.rating);


  const addVotePost = async (userVote) => {
    const data = getLocalStorage("userData");
    if (!data) {
      console.log("no local storage data :(");
    } else {
      const caller = new FetchCalls(
        `/posts/vote/${props.post._id}`,
        "PATCH",
        data.jwt,
        { rating: voteCount + userVote }
      );
      const response = await caller.protectedBody();
      if (response.ok) {
        setVoteCount(voteCount + userVote);
      } else {
        console.log();
      }
    }
  };

  return (
    <div>
      <Link to={`/post?postId=${props.post._id}`}>
        <section>
          <div>
            <h3>{props.post.title}</h3>
          </div>
          {/* I am not sure if I want to show content in the preview */}
          <p>{props.post.content}</p>
        </section>
      </Link>
      <VotingInterface voteCount={voteCount} addVoteHandler={addVotePost} />
    </div>
  );
};

export default PostPreview;
