import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import FetchCalls from "../utils/fetchCalls";
import Header from "../components/header";
import Footer from "../components/footer";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [renderErrorMessage, setRenderErrorMessage] = useState(false);
  const navigate = useNavigate();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const verificationCode = urlParams.get("code");

  const handleResetPassword = async () => {
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        const body = { verificationCode, password };

        const apiCaller = new FetchCalls(
          "/users/approve-password-reset",
          "PATCH",
          null,
          body
        );

        const response = await apiCaller.protectedBody();
        if (response.ok) {
          navigate("/");
        }
      } else {
        setRenderErrorMessage(true);
      }
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <input
              required
              placeholder="Enter new password"
              type="text"
              name="newPassword"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <input
              required
              placeholder="Enter password again"
              type="text"
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button text="Reset password" action={handleResetPassword} />
        </form>
        {renderErrorMessage && <div>Error in your request</div>}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
