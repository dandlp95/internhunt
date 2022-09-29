import React from "react";
import "./post.css";
import { useState, useEffect } from "react";
import { getApiRoot } from "./utils/getApiRoot";
import { useParams, Link, Route, Routes } from "react-router-dom";

const Posts = () => {
  const [queryMajor, setQueryMajor] = useState(""); // This is to create another call to the backend for a different major, this will be used in the second use effect
  const [posts, setPosts] = useState([]);
  const { major } = useParams();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const userMajor = userData.major;

    const getPosts = async () => {
      const options = {
        method: "GET",
        headers: { "Content-type": "application/json" },
      };

      const response = await fetch(
        getApiRoot() + "/posts/getPostsByMajor/" + userMajor,
        options
      );

      if (response.ok) {
        // do something
        const posts = await response.json();
        setPosts(posts)
      } else {
        // do something
      }
    };
  }, []);

  useEffect(() => {}, [queryMajor]); //There will be a button that will change queryMajor to something else, which will cause page to re-render

  useEffect(()=>{}, []) // There will be a third use effect to sort data from new to old, etc...


  return <div></div>;
};

export default Posts;
