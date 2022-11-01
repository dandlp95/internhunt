import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { useState, useEffect } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import PostPreview from "../components/postPreview";
import FetchCalls from "../utils/fetchCalls";
import Button from "../components/button";
import VotingInterface from "../components/votingInterface";

const AccountPortal = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);
  const [voteCount, setVoteCount] = useState(props.post.rating);
  const [rerenderChild, setRerenderChild] = useState(true);

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
        alert("error fetching user.");
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

  const editPassword = async () => {};

  const addVoteComment = async () => {};

  if (user) {
    return (
      <div>
        <Header accountId={user._id} />
        <div>
          <div>
            <section>
              <h2>Personal Information</h2>
              <p>
                {user.firstName} {user.lastName}
              </p>
              <p>{user.major.name}</p>
              <Button text="Change Password" action={editPassword} />
            </section>
            <section>
              <h2>Your Posts</h2>
              {posts.map((post) => (
                <div>
                  <section>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                  </section>
                  <div>
                    <VotingInterface
                      voteCount={voteCount}
                      addVoteHandler={addVoteComment}
                      postInfo={post}
                      key={rerenderChild}
                    />
                  </div>
                </div>
              ))}
            </section>
            <section>
              {/* Add something here for the comments (model it after reddit.) */}
            </section>
          </div>
        </div>
      </div>
    );
  }
};

export default AccountPortal;
