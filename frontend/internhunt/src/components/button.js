import React from "react";
import "./background.css"

const Button = (props) => {
  return (
    <div className="buttonComponent">
      <input type="submit" value={props.text} onClick={props.action} />
    </div>
  );
};

export default Button;
