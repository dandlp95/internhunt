import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { isAuth } from "../utils/isLoggedIn";
import guidelines from "../utils/guidelines.json";
import examples from "../utils/examples.json";
import tips from "../utils/tips.json";

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
          <div className="communityStandardsIntro">
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
          <div className="guidelines">
            <h2>Unacceptable Behavior</h2>
            <div className="guidelines-container">
              {guidelines.map((guideline) => (
                <section className="guideline-container">
                  <h3 className="guideline-title">{guideline.title}</h3>
                  <p className="guideline-content">{guideline.content}</p>
                </section>
              ))}
            </div>
            <div className="tips">
              <h2>Help us create a place with high-quality content!</h2>
              <div className="tips-container">
                {tips.map((tip) => (
                  <section className="tip-container">
                    <h3 className="tip-rule">{tip.rule}</h3>
                    <p className="tip-explanation">{tip.explanation}</p>
                  </section>
                ))}
              </div>
            </div>
            <div className="examples">
              <table className="examplesTable">
                <tr>
                  <th>Friendly</th>
                  <th>Unfriendly</th>
                </tr>
                {examples.map((example) => (
                  <tr>
                    <th>{example.friendly}</th>
                    <th>{example.unfriendly}</th>
                  </tr>
                ))}
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Guidelines;
