import React from "react";
import Button from "../components/button";
import { useState, useEffect } from "react";
import { getApiRoot } from "./utils/getApiRoot";
import FetchCalls from "../utils/fetchCalls";

/* MajorInput component */
const MajorInput = () => {
  const [majorsList, setMajorsList] = useState([]);
  useEffect(() => {
    const getMajors = async () => {
      const fetchCallGetMajors = new FetchCalls("/majors", "GET");
      const response = await fetchCallGetMajors.publicGet();

      if (response.ok) {
        const majors = await response.json();
        setMajorsList(majors);
      }
      getMajors();
    };
  }, []);

  return (
    <div>
      <label>For what majors is this post relevant?</label>
      <datalist>
        {majorsList.map((major) => (
          <option data-value={major._id} value={major.name} />
        ))}
      </datalist>
    </div>
  );
};

/* CreatePost component */
const CreatePost = () => {
  const [targetMajor, setTargetMajor] = useState(1); // When they choose a major

  useEffect(() => {}, []);
  return (
    <div>
      <div>
        <input placeholder="Title" />
      </div>
      <div>
        <input placeholder="Text" />
      </div>
    </div>
  );
};

export default CreatePost;
