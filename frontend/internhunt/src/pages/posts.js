import React from "react";
import "./posts.css";
import { useState, useEffect } from "react";
import { getApiRoot } from "../utils/getApiRoot";
import { useParams, Link, Route, Routes } from "react-router-dom";
import PostPreview from "../components/postPreview";
import InputInterface from "../components/inputInterface";

const Posts = () => {
  const [queryMajor, setQueryMajor] = useState(""); // This is to create another call to the backend for a different major, this will be used in the second use effect
  const [posts, setPosts] = useState([]);
  const { major } = useParams();

  useEffect(() => {
    console.log(major)
    const userData = localStorage.getItem("userData");
    const userDataJson = JSON.parse(userData);
    const userMajor = userDataJson.major;

    const getPostsByMajor = async () => {
      const options = {
        method: "GET",
        headers: { "Content-type": "application/json" },
      };

      const response = await fetch(
        getApiRoot() + "/posts/getPostsByMajor/" + encodeURI(userMajor),
        options
      );

      if (response.ok) {
        // do something
        const foundPosts = await response.json();
        setPosts(foundPosts);
      } else {
        // do something
        console.log(response);
      }
    };

    const getPostsByQuery = async () => {



    };
    // If url search parameters is null, run the function below
    getPostsByMajor();

    // If url search parameters is not null, run the function below
    getPostsByMajor();
  }, []);

  useEffect(() => {}, [queryMajor]); //There will be a button that will change queryMajor to something else, which will cause page to re-render

  useEffect(() => {}, []); // There will be a third use effect to sort data from new to old, etc...

  return (
    <div>
      <div className="make new post and filter...">
        <Link to={`/create-post`}>
          <div>
            <input placeholder="Create post" />
          </div>
        </Link>
      </div>
      <div className="the queries to see other majors and such"></div>
      <div className="The posts and pagination will be on this one.">
        <div className="posts">
          posts here.
          {posts.map((post) => (
            <PostPreview post={post} />
          ))}
        </div>
        <div className="pagination"></div>
      </div>
    </div>
  );
};

export default Posts;
