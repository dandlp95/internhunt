import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FetchCalls from "../utils/fetchCalls";
import { isAuth } from "../utils/isLoggedIn";
import Header from "../components/header";
import "./personalSettings.css"

const PersonalSettings = (props) => {
  const [user, setUser] = useState();
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [newPasswordConfirm, setNewPasswordConfirm] = useState();
  const [oldPasswordExists, setOldPasswordExists] = useState(false);

  const [message1, setMessage1] = useState(null);
  const [message2, setMessage2] = useState(null);
  const [confirmationResponse, setConfirmationResponse] = useState();
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const response = await isAuth();
    if (response.ok) {
      const fetchUser = await response.json();
      console.log(fetchUser);
      setUser(fetchUser);
      setOldPasswordExists(fetchUser.customPassword);
    } else {
      alert("Please log in");
      navigate("/");
    }
  };

  const sendRequest = async () => {
    const user = localStorage.getItem("userData");
    if (!oldPassword) {
      setMessage1(null);
      if (newPassword === newPasswordConfirm) {
        const body = {
          currPassword: oldPassword,
          newPassword: newPassword,
        };

        const backendCaller = new FetchCalls(
          `/users/edit-password${user.userId}`,
          "PATCH",
          user.jwt,
          body
        );

        const response = await backendCaller.protectedBody();
        if (response.status === 200) {
          setMessage2("Your password has been succesfully changed.");
        }
      } else {
        setMessage2("Passwords don't match");
      }
    } else {
      setMessage1("Please enter your old password.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (user) {
    if (oldPasswordExists) {
      return (
        <div className="password-change-main">
          <Header accountId={user._id} />
          <div className="password-ui-container">
            <div className="password-header">
              <h2>Change Password</h2>
              <hr />
            </div>
            <div className="passwords-inputs">
              <input
                type="text"
                placeholder="Enter your old password"
                onChange={(e) => setOldPassword(e.target.value)}
                className="old-password-input"
              />
              <div className="new-password-container">
                <input
                  type="text"
                  placeholder="Enter your new password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter your new password again"
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                />
              </div>
              <div className="buttons">
                <button>Change Password</button>
                <button onClick={(e) => props.closeUI(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="password-change-main">
          <Header accountId={user._id} />
          <div></div>
          <div>
            An email will be sent to your registered email address with a link
            to reset your password.
          </div>
          <button>Send Link</button>
        </div>
      );
    }
  }
};

export default PersonalSettings;
