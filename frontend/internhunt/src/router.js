import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import PostsPage from "./pages/posts";
//import PostPage from "./components/post";
import AccountPortal from "./pages/accountPortal";
import AboutPage from "./pages/aboutPage";
import Guidelines from "./pages/guidelines";
import Login from "./pages/login";
import PostPage from "./pages/postPage";
import CreatePost from "./pages/createPost";

const router = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        {/* you can pass the query params after posts like this /posts/?major=software_engineer and filter the results in the frontend. Even with the extra query params, it will still go to that router */}
        <Route path="/posts/:major" element={<PostsPage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/account-portal" element={<AccountPortal />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </Router>
  );
};

export default router;
