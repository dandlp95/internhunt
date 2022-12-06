import React, { useState, useEffect } from "react";
import FetchCalls from "../utils/fetchCalls";

const UserManager = () => {
  const [bannedUsers, setBannedUsers] = useState([]);
  const [errMessage, setErrMessage] = useState();
  const [bannedUser, setBannedUser] = useState();

  const removeBan = async () => {};

  useEffect(() => {
    const getUsers = async () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const backendCaller = new FetchCalls(
        "/users/getBannedUsers",
        "GET",
        userData.jwt
      );
      const response = await backendCaller.protectedNoBody();
      if (response.ok) {
        const users = await response.json();
        setBannedUsers(users);
      } else {
        const errMessage = await response.json();
        setErrMessage(errMessage.message);
      }
    };
    getUsers();
  }, []);

  return (
    <div className="user-manager-main">
      <input
        value={bannedUser}
        onChange={(e) => setBannedUser(e.target.value)}
        list="users"
      />
      <datalist id="users">
        {bannedUsers.map((user) => (
          <option data-value={user._id} value={user.email} key={user._id} />
        ))}
      </datalist>
      <div className="ban-button">
        <button onClick={() => removeBan()}>Remove Ban</button>
      </div>
    </div>
  );
};

export default UserManager;
