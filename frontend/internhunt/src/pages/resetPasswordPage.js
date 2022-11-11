import React, { useState, useEffect } from "react";
import Button from "../components/button";
import FetchCalls from "../utils/fetchCalls";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [renderErrorMessage, setRenderErrorMessage] = useState(false);

  useEffect(() => {
    const handleResetPassword = async () => {
      if (password && confirmPassword) {
        const apiCaller = new FetchCalls(``);
      } else {
        setRenderErrorMessage(true);
      }
    };
  }, []);

  return (
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
    </div>
  );
};

export default ResetPasswordPage;
