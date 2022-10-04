import React from "react";
import { useState, useEffect } from "react";

const PostPreview = (props) => {
  return (
    <section>
      <div>
        <h3>{props.post.title}</h3>
        <p>{props.post.rating}</p>
      </div>
      {/* I am not sure if I want to show content in the preview */}
      <p>{props.post.content}</p> 
    </section>
  );
};

export default PostPreview