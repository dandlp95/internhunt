import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { isAuth } from "../utils/isLoggedIn";

const Guidelines = () => {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = async () => {
      const res = await isAuth();
      if (!res.ok) {
        alert("Please log in");
        navigate("/");
      } else {
        const userData = localStorage.getItem("userData");
        const userDataJson = JSON.parse(userData);
        setUser(userDataJson.userId);
      }
    };
    isLoggedIn();
  }, []);

  return (
    <div>
      <Header accountId={user} />
      <div className="guidelinesMain">
        <div>
          <h3>Community Standards</h3>
          <div>
            <p>
              The Community Standards helps us build a community culture based
              on mutual respect and collaboration
            </p>
            <p>
              Wether you are seeking help, or you generously would like to help
              your peers in their career endeavors, join Internhunt in creating
              a community where all students feel welcome
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Guidelines;
