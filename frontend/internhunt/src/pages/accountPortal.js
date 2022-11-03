import Header from "../components/header";
import Footer from "../components/footer";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostPreview from "../components/postPreview";
import FetchCalls from "../utils/fetchCalls";
import Button from "../components/button";
import CommentPreview from "../components/commentPreview";
const AccountPortal = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  let userData = localStorage.getItem("userData");
  userData = JSON.parse(userData);

  const getUserInfo = async () => {
    const backendApi = new FetchCalls(
      `/users/getByIdPrivate/${id}`,
      "GET",
      userData.jwt
    );
    const response = await backendApi.protectedNoBody();
    if (response.ok) {
      const usersResponse = await response.json();
      setUser(usersResponse);
    } else {
      alert("error fetching user.");
    }
  };

  const getCommentsByUser = async () => {
    const backendApi = new FetchCalls(
      `/comments/getByUser/${id}`,
      "GET",
      userData.jwt
    );
    const response = await backendApi.protectedNoBody();
    if (response.ok) {
      const comments = await response.json();
      setComments(comments);
    }
  };

  const getUserPosts = async () => {
    const backendApi = new FetchCalls(
      `/posts/getPostByUser/${userData.userId}`,
      "GET"
    );
    const response = await backendApi.publicGet();
    if (response.ok) {
      setPosts(await response.json());
    }
  };

  useEffect(() => {
    getUserInfo();
    getUserPosts();
    getCommentsByUser();
  }, []);

  const editPassword = async () => {};

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
                <PostPreview post={post} />
              ))}
            </section>
            <section>
              <h2>Your Comments</h2>
              {comments.map((comment) => (
                <div>
                  {console.log(comment)}
                  <CommentPreview comment={comment} />
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    );
  }
};

export default AccountPortal;
