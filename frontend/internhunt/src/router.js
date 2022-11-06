import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import PostsPage from "./pages/posts";
import AccountPortal from "./pages/accountPortal";
import AboutPage from "./pages/aboutPage";
import Guidelines from "./pages/guidelines";
import PostPage from "./pages/postPage";
import CreatePost from "./pages/createPost";
import MajorsPage from "./pages/majorsPage";

const router = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/account-portal/:id" element={<AccountPortal />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/majors" element={<MajorsPage />} />
      </Routes>
    </Router>
  );
};

export default router;
