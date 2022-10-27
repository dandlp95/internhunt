import React from "react";
import { useState, useEffect } from "react";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import FetchCalls from "../utils/fetchCalls";

const VotingInterface = (props) => {
  const [isUpDisabled, setIsUpDisabled] = useState();
  const [isDownDisabled, setIsDownDisabled] = useState();
  const [vote, setVote] = useState();

  useEffect(() => {
    const getVotingHistory = async () => {
      const userData = localStorage.getItem("userData");
      const userJWT = JSON.parse(userData).jwt;
      const caller = new FetchCalls(
        `/votingHistory/getById/${props.postInfo._id}`,
        "GET",
        userJWT
      );
      const response = await caller.protectedNoBody();
      var lastVote;

      if (response.ok) {
        const votingHistory = await response.json();
        if (votingHistory.lastVote) {
          lastVote = votingHistory.lastVote;
        } else {
          lastVote = 0;
        }
      } else {
        lastVote = 0;
      }

      if (lastVote == 1) {
        setIsUpDisabled(true);
        setIsDownDisabled(false);
      } else if (lastVote == -1) {
        setIsDownDisabled(true);
        setIsUpDisabled(false);
      } else {
        setIsDownDisabled(false);
        setIsUpDisabled(false);
      }
    };

    getVotingHistory();
  }, [props.postInfo._id]);

  const handleVote = (userVote) => {
    props.addVoteHandler(userVote);
  };
  return (
    <div className="voting-interface">
      <BiUpArrow
        className="vote-up"
        onClick={(e) => handleVote(1)}
        disabled={isUpDisabled}
      />

      {props.voteCount}

      <BiDownArrow
        className="vote-down"
        onClick={(e) => handleVote(-1)}
        disabled={isDownDisabled}
      />
    </div>
  );
};

export default VotingInterface;
