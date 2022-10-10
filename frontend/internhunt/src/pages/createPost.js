import React from "react";
import Button from "../components/button";
import { useState, useEffect, useRef } from "react";
import { getApiRoot } from "../utils/getApiRoot";
import FetchCalls from "../utils/fetchCalls";
import { isAuth } from "../utils/isLoggedIn";
import { Navigate, useNavigate } from "react-router-dom";
import getUserById from "../utils/getUserId";

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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  //const [user, setUser] = useState("");
  const [state, setState] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const getInputMajors = (major) => {
    const newMajorList = majorList.slice(); // Slice creates a copy rather than a pointer.
    newMajorList.push(major);
    setMajorList(newMajorList);
  };

  // Maybe instead of using 2 useEffects, create the isLoggedIn function outside and call it inside the next one
  useEffect(() => {
    const isLoggedIn = async () => {
      const response = await isAuth();
      if (response.ok) {
      } else {
        alert("Please log in");
        navigate("/");
      }
    };
    isLoggedIn();
  }, []);

  useEffect(() => {
    setMajorInputList(
      majorInputList.concat(<MajorInput callback={getInputMajors} />)
    );
  }, [majorList]);

  const postPost = async () => {
    const response1 = await getUserById();

    if (response1.ok) {
      const owner = await response1.json();
      const userId = owner._id;
      const body = {
        title: title,
        content: content,
        owner: userId,
        state: state,
        company: company,
        type: type,
        majors: majorList,
      };

      const postObject = new FetchCalls("/posts/add", "POST", null, body);
      const response2 = postObject.protectedPost();

      if (response2.ok) {
        const newPost = await response2.json();
        const postId = newPost._id;
        navigate(`/post?postId=${postId}`);
      } else {
        alert("Something went wrong.");
      }
    } else {
      alert("Error!");
    }
  };

  return (
    <div>
      <div>
        <input
          placeholder="Title"
          type="text"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <input
          placeholder="Text"
          type="text"
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <label>For what majors is this post relevant?</label>
        {majorInputList}
      </div>
      <div>
        <p>What category best describes your post? </p>
        <div onChange={(e) => setType(e.target.value)}>
          <input
            type="radio"
            value="Question"
            name="type "
            checked={type === "Question"}
          />{" "}
          Question
          <input
            type="radio"
            value="Review"
            name="type"
            checked={type === "Review"}
          />
          Internship review
          <input
            type="radio"
            value="Advise"
            name="type"
            checked={type === "Advise"}
          />
          Advise
        </div>
      </div>
      <div>
        <section>
          <div>
            <h3>If applicable, fill the following information.</h3>
            <input
              placeholder="Company name"
              type="text"
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div>
            <label>State</label>
            <select onChange={(e) => setState(e.target.value)}>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="DC">District Of Columbia</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
          </div>
        </section>
      </div>
      <div>
        <Button text="Post" onClick={postPost} />
      </div>
    </div>
  );
};

export default CreatePost;

// function Demo() {
//   const [gender, setGender] = useState("Male");

//   function onChangeValue(event) {
//     setGender(event.target.value);
//     console.log(event.target.value);
//   }

//   return (
//     <div onChange={onChangeValue}>
//       <input type="radio" value="Male" name="gender" checked={gender === "Male"} /> Male
//       <input type="radio" value="Female" name="gender" checked={gender === "Female"}/> Female
//       <input type="radio" value="Other" name="gender" checked={gender === "Other"} /> Other
//     </div>
//   );
// }
