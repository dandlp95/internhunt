import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CommentPreview = (props) => {
  const [commentUser, setCommentUser] = useState(
    props.comment.owner.firstName + props.comment.owner.lastName
  );
  const [postTitle, setPostTitle] = useState("");
  const [titleLink, setTitleLink] = useState(false);

  useEffect(() => {
    if (props.comment.post) {
      setPostTitle(props.comment.post.title);
      setTitleLink(true);
    } else {
      setPostTitle("[Deleted Post]");
    }
  }, []);

  return (
    <div>
      <div>
        <div>
          <p>
            {commentUser} commented on{" "}
            {titleLink ? (
              <Link to={`/post?postId=${props.comment.post._id}`}>{postTitle}</Link>
            ) : (
              <div>{postTitle}</div>
            )}
          </p>
        </div>
        <div>
          <p>{props.comment.content}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentPreview;
//<Link to={`/post`}>{postTitle}</Link>
