import { useEffect, useState } from "react";
import React from "react";
import { getApiRoot } from "../utils/getApiRoot";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import Button from "./button";

const InputInterface = (props) => {
  const [input, setInput] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);

  const sendData = () => {
    if (input) {
      const data = input;
      setInput("");
      props.action(data);
    }
  };

  return (
    <div className="input-interface-main">
      <div className="comment-input">
        <textarea
          placeholder={props.placeholder}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <button onClick={(e) => sendData()}>{props.buttonText}</button>
    </div>
  );
};

export default InputInterface;
