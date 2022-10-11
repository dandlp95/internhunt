import { useEffect, useState } from "react";
import React from "react";
import { getApiRoot } from "../utils/getApiRoot";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import Button from "./button";

const InputInterface = (props) => {
  const [comment, setComment] = useState();

  const sendData = () => {
      props.action(comment);
  };
  
  return (
    <div>
      <div>
        <input
          placeholder={props.placeholder}
          type="text"
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <Button text={props.buttonText} action={sendData} />
    </div>
  );
};

export default InputInterface;
