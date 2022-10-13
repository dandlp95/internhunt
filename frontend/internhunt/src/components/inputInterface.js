import { useEffect, useState } from "react";
import React from "react";
import { getApiRoot } from "../utils/getApiRoot";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import Button from "./button";

const InputInterface = (props) => {
  const [input, setInput] = useState();
  

  const sendData = () => {
      props.action(input);
  };
  
  return (
    <div>
      <div>
        <input
          placeholder={props.placeholder}
          type="text"
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <Button text={props.buttonText} action={sendData} />
    </div>
  );
};

export default InputInterface;
