import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FetchCalls from "../utils/fetchCalls";
import { isAuth } from "../utils/isLoggedIn";
import Header from "../components/header";
import "./personalSettings.css";

const PersonalSettings = (props) => {
  const [user, setUser] = useState();
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [newPasswordConfirm, setNewPasswordConfirm] = useState();
  const [oldPasswordExists, setOldPasswordExists] = useState(false);

  const [message1, setMessage1] = useState(null);
  const [message2, setMessage2] = useState(null);
  const [confirmationResponse, setConfirmationResponse] = useState();
  const [isErr, setIsErr] = useState(false);
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

  const requestPasswordChange = async () => {
    const user = JSON.parse(localStorage.getItem("userData"));

    if (!oldPassword) {
      setMessage1(null);
      if (newPassword === newPasswordConfirm) {
        const body = {
          currPassword: oldPassword,
          newPassword: newPassword,
        };

        const backendCaller = new FetchCalls(
          `/users/edit-password/${user.userId}`,
          "PATCH",
          user.jwt,
          body
        );

        const response = await backendCaller.protectedBody();
        if (response.ok) {
          setConfirmationResponse(
            "Your password has been succesfully changed."
          );
        } else {
          const data = await response.json();
          console.log("this is the error", data);
        }
      } else {
        setMessage2("Passwords don't match");
      }
    } else {
      setMessage1("Please enter your old password.");
    }
  };

  const requestEmailCode = async () => {
    var user;

    const res = await isAuth();
    if (res.ok) {
      user = await res.json();
    } else {
      alert("Please login");
      navigate("/");
    }

    const email = user.email;

    const backendCaller = new FetchCalls(
      "/users/request-password-reset",
      "PATCH",
      null,
      { email }
    );

    const response = await backendCaller.protectedBody();
    if (response.ok) {
      setConfirmationResponse(
        "The link was sent to your registered email address. Use it to set a new password"
      );
    } else {
      setIsErr(true);
      const error = await response.json();
      setConfirmationResponse(error.message);
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
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="password-change-main">
          <Header accountId={user._id} />
          <div className="password-ui-container">
            <div className="password-header">
              <h2>Change Password</h2>
              <hr />
            </div>
            <div>
              To set a password through the website, click the "Send Link"
              button to receive a link to your email, which you can use to set a
              new password.
            </div>
            <div className="buttons">
              <button
                onClick={(e) => {
                  requestEmailCode();
                }}
              >
                Send Link
              </button>
            </div>
            {confirmationResponse && (
              <div
                className={isErr ? "error-response" : "confirmation-response"}
              >
                {confirmationResponse}
              </div>
            )}
          </div>
        </div>
      );
    }
  }
};

export default PersonalSettings;
