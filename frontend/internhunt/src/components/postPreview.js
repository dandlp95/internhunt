import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import VotingInterface from "./votingInterface";
import getLocalStorage from "../utils/getLocalStorage";
import FetchCalls from "../utils/fetchCalls";

const PostPreview = (props) => {
  const [post, setPost] = useState(props.post);
  const [voteCount, setVoteCount] = useState(props.post.rating);
  const [rerenderChild, setRerenderChild] = useState(true);

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
        `/posts/vote/${voteReq}/${post._id}`,
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
    //setRerenderChild(!rerenderChild);
  };

  return (
    <div>
      <Link to={`/post?postId=${post._id}`}>
        <section>
          <div>
            <h3>{post.title}</h3>
          </div>
          {/* I am not sure if I want to show content in the preview */}
          <p>{post.content}</p>
        </section>
      </Link>
      <VotingInterface
        voteCount={voteCount}
        addVoteHandler={addVotePost}
        postInfo={post}
        key={voteCount}
        // reRenderPost={post}
      />
    </div>
  );
};

export default PostPreview;
