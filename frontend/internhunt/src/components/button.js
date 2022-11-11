import React from "react";
import "./button.css";
import "./background.css";

const Button = (props) => {
  return (
    <div className="buttonComponent">
      <input type="submit" value={props.text} onClick={(e) => props.action} />
    </div>
  );
};

export default Button;
