import React, { useEffect, useState } from "react";
import FetchCalls from "../utils/fetchCalls";
import { getApiRoot } from "../utils/getApiRoot";
import "./changeMajor.css";

const ChangeMajor = () => {
  var userData = JSON.parse(localStorage.getItem("userData"));
  var localStorageMajor;
  console.log("local storage info: ", userData);
  if (!userData.major || userData.major === "null") {
    localStorageMajor = null;
  }

  const [major, setMajor] = useState(localStorageMajor);
  const [edit, setEdit] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState(false);

  const requestMajorChange = async () => {
    const backendCaller = new FetchCalls(
      `/users/edit/${userData.userId}`,
      "PATCH",
      userData.jwt,
      { major: major }
    );
    const response = await backendCaller.protectedBody();
    if (response.ok) {
      setConfirmationMessage("Your major has been changed.");
    } else {
    }
  };

  const handleCancel = () => {
    setMajor(false);
    setEdit(false);
  };

  useEffect(() => {}, []);

  if (!edit) {
    return (
      <div className="change-major-main">
        <div className="change-major-title">
          <h2>Change your Major</h2>
          <hr />
        </div>
        <div className="change-major-input">
          <input value={major ? major : "--No major declared--"} disabled />
          <div className="change-major-button-container">
            <button onClick={(e) => setEdit(true)}>Change Major</button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="change-major-main">
        <div className="change-major-title">
          <h2>Change your Major</h2>
          <hr />
        </div>
        <div className="change-major-input">
          <input
            value={major ? major : setMajor(" ")}
            onChange={(e) => setMajor(e.target.value)}
          />
          <div className="change-major-button-container">
            <button onClick={(e) => requestMajorChange()}>Save</button>
            <button onClick={(e) => handleCancel()}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
};

export default ChangeMajor;
