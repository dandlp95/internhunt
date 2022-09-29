import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import PostsPage from "./components/posts";
import PostPage from "./components/post";
import AccountPortal from "./components/accountPortal";
import AboutPage from "./components/about";
import Guidelines from "./components/guidelines";

const router = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        {/* you can pass the query params after posts like this /posts/?major=software_engineer and filter the results in the frontend. Even with the extra query params, it will still go to that router */}
        <Route path="/posts/:major" element={<PostsPage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/account-portal" element={<AccountPortal />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/guidelines" element={<Guidelines />} />
      </Routes>
    </Router>
  );
};

export default router;
