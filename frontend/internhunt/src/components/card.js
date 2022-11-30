import React from "react";
import "./card.css";

const Card = (props) => {
  return (
    <div className="card-main">
      <div className="content-container">
        <div>
          <h2>{props.major.name}</h2>
        </div>
        <div>
          <p>{props.major.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
