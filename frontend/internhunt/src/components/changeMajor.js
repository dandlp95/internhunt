import React, { useEffect, useState } from "react";
import FetchCalls from "../utils/fetchCalls";
import { getApiRoot } from "../utils/getApiRoot";

const ChangeMajor = () => {
  var userData = JSON.parse(localStorage.getItem("userData"));
  var localStorageMajor;
  console.log("local storage info: ", userData);
  if (!userData.major || userData.major === "null") {
    localStorageMajor = null;
  }

  const [major, setMajor] = useState(localStorageMajor);
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

  useEffect(() => {}, []);

  return (
    <div>
      <div>
        <h2>Change your Major</h2>
        <hr />
      </div>
      <div>
        <input
          value={major ? major : "Enter Major: "}
          onChange={(e) => setMajor(e.target.value)}
        />
        <button onClick={(e) => requestMajorChange()}>Change Major</button>
      </div>
    </div>
  );
};

export default ChangeMajor;
