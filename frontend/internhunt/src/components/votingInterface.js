import React from "react";
import { useState, useEffect } from "react";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";

const VotingInterface = (props) => {

  const handleVote = (userVote) => {
    props.addVoteHandler(userVote);
  };
  return (
    <div className="voting-interface">
      <BiUpArrow className="vote-up" onClick={(e) => handleVote(1)} />
      {props.voteCount}
      <BiDownArrow className="vote-down" onClick={(e) => handleVote(-1)} />
    </div>
  );
};

export default VotingInterface;
