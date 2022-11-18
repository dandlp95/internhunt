import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import VotingInterface from "./votingInterface";
import getLocalStorage from "../utils/getLocalStorage";
import FetchCalls from "../utils/fetchCalls";

const PostPreview = (props) => {
  const [post, setPost] = useState(props.post);
  const [voteCount, setVoteCount] = useState(props.post.rating);
  console.log(props.user)
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
  };

  return (
    <div className="postpreview">
      <VotingInterface
        voteCount={voteCount}
        addVoteHandler={addVotePost}
        postInfo={post}
        key={voteCount}
      />
      <div>
        <div className="post-metadata">
          Posted by 
        </div>
        <Link to={`/post?postId=${post._id}`}>
          <section>
            <div>
              <h3>{post.title}</h3>
            </div>
            <p>{post.content}</p>
          </section>
        </Link>
      </div>
    </div>
  );
};

export default PostPreview;
