import React, { useEffect, useState } from "react";
import FetchCalls from "../utils/fetchCalls";
import Header from "../components/header";
import PasswordInput from "../components/passwordInput";
import "./resetPasswordPage.css";

const ResetPasswordPage = () => {
  const requestPasswordChange = async () => {
    const backendCaller = new FetchCalls("/users/");
  };

  useEffect(() => {}, []);

  return (
    <div className="reset-password-page">
      <Header />
      <div className="reset-password-container">
        <h2>Change Password</h2>
        <hr/>
        <PasswordInput />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
