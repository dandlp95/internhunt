import React, { useState } from "react";
import FetchCalls from "../utils/fetchCalls";
import Button from "./button";

const InstructionsSuccess = (props) => {
  return <div className="resetPasswordInstructions">{props.message}</div>;
};

const ForgotPassword = () => {
  const [email, setEmail] = useState();
  const [displayInstructions, setDisplayInstructions] = useState(false);
  const [instructionsMessage, setInstructionsMessage] = useState("");

  const handleRequestPasswordReset = async () => {
    const backendCaller = new FetchCalls(
      "/users/request-password-reset",
      "PATCH",
      null,
      { email: email }
    );
    const response = await backendCaller.publicBody();

    console.log(response);
    if (response.ok) {
      setInstructionsMessage(
        `An email with instructions on how to reset your password has been sent.
        If you don't receive it within 5 minutes, please submit the request again.`
      );
    } else if (response.status === 404) {
      setInstructionsMessage("Email not found.");
    } else {
      setInstructionsMessage("There was an error. Please try again.");
    }
    setDisplayInstructions(true);
  };

  console.log(email);
  return (
    <div>
      <div>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            required
            placeholder="Enter your email account"
            type="text"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button text="Send code" action={handleRequestPasswordReset} />
        </form>
        <div>
          {displayInstructions && (
            <InstructionsSuccess message={instructionsMessage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
