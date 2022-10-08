import React from "react";
import Button from "../components/button";
import { useState, useEffect, useRef } from "react";
import { getApiRoot } from "../utils/getApiRoot";
import FetchCalls from "../utils/fetchCalls";

/* MajorInput component */
const MajorInput = (props) => {
  const [majorsList, setMajorsList] = useState([]);
  const [major, setMajor] = useState();
  const inputMajor = useRef();

  useEffect(() => {
    const getMajors = async () => {
      const fetchCallGetMajors = new FetchCalls("/majors", "GET");
      const response = await fetchCallGetMajors.publicGet();

      if (response.ok) {
        const majors = await response.json();
        setMajorsList(majors);
      }
    };
    getMajors();
  }, []);

  const submitMajorInput = (e) => {
    const input = inputMajor.current.value;
    props.callback(input);
  };

  return (
    <div>
      <input type="text" list="majors" ref={inputMajor} />
      <datalist id="majors">
        {majorsList.map((major) => (
          <option data-value={major._id} value={major.name} />
        ))}
      </datalist>
      <button onClick={submitMajorInput}>Add Major</button>
    </div>
  );
};

/* CreatePost component */
const CreatePost = () => {
  /* majorInputList refers to the input boxes to add the major
  majorList refers to the list of majors... */
  const [majorInputList, setMajorInputList] = useState([]);
  const [majorList, setMajorList] = useState([]);

  const getInputMajors = (major) => {
    const newMajorList = majorList.slice();
    newMajorList.push(major);
    setMajorList(newMajorList);
  };
  useEffect(() => {
    setMajorInputList(
      majorInputList.concat(<MajorInput callback={getInputMajors} />)
    );
  }, [majorList]);

  return (
    <div>
      <div>
        <input placeholder="Title" />
      </div>
      <div>
        <input placeholder="Text" />
      </div>
      <label>For what majors is this post relevant?</label>
      {majorInputList}
    </div>
  );
};

export default CreatePost;
