import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { useState, useEffect } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import PostPreview from "../components/postPreview";
import FetchCalls from "../utils/fetchCalls";

const AccountPortal = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [isSuspended, setIsSuspended] = useState(false);
  const [posts, setPosts] = useState([]);

  let userData = localStorage.getItem("userData");
  userData = JSON.parse(userData);

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function formatDate(date) {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join("/");
  }

  useEffect(() => {
    const getUserInfo = async () => {
      const backendApi = new FetchCalls(
        `/users/getByIdPrivate/${id}`,
        "GET",
        userData.jwt
      );
      const response = await backendApi.protectedNoBody();
      if (response.ok) {
        console.log("users were fetched.");
        const usersResponse = await response.json();
        setUser(usersResponse);
      } else {
        alert("error fetching users.");
      }
    };
    getUserInfo();
  }, []);

  useEffect(() => {
    const backendApi = new FetchCalls(
      `/posts/getPostByUser/${userData.userId}`,
      "GET"
    );
    const getUserPosts = async () => {
      const response = await backendApi.publicGet();
      if (response.ok) {
        setPosts(await response.json());
      }
    };
    getUserPosts();
  }, []);

  useEffect(() => {
    const userStatus = () => {
      if (user.suspension.isSuspended) {
        setIsSuspended(true);
      }
    };
    if (user) {
      userStatus();
    }
  }, [user]);

  if (user) {
    return (
      <div>
        <Header accountId={user._id} />
        <div>
          {isSuspended ? (
            <div>
              <p>
                Account status: Suspended until{" "}
                {formatDate(user.suspension.expire)}
              </p>
            </div>
          ) : (
            <div>Account status: Active</div>
          )}
          <div>
            {user.warnings.map((warning) => (
              // This will need to be formated better...
              <div>
                <p>Violation: {warning.userViolation}</p>
                <p>Information: {warning.warningText}</p>
                <p>Issued: {formatDate(warning.expiration)}</p>
              </div>
            ))}
          </div>
          <div>
            <section>
              <h3>Your Posts</h3>
              {posts.map((post) => (
                <section>
                  <h2>{post.title}</h2>
                  <p>{post.content}</p>
                </section>
              ))}
            </section>
          </div>
        </div>
      </div>
    );
  }
};

export default AccountPortal;
