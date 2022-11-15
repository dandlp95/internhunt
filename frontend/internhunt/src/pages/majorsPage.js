import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FetchCalls from "../utils/fetchCalls";
import getLocalStorage from "../utils/getLocalStorage";
import Header from "../components/header";
import Footer from "../components/footer";
import { isAuth } from "../utils/isLoggedIn";

const MajorsPage = () => {
  const [majors, setMajors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  const getMajors = async () => {
    const fetchData = new FetchCalls("/majors", "GET");
    const data = await fetchData.publicGet();
    setMajors(await data.json());
  };

  const getByDepartments = async () => {
    const fetchData = new FetchCalls("/departments", "GET");
    const data = await fetchData.publicGet();
    setDepartments(await data.json());
  };

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

  useEffect(() => {
    getMajors();
    getByDepartments();
  }, []);

  const handleDepartmentClick = async (departmentId) => {
    // Change this so that the obtained data is filtered instead of making a call every time...
    const fetchData = new FetchCalls(
      `/majors/getByDepartment/${departmentId}`,
      "GET"
    );
    const data = await fetchData.publicGet();
    setMajors(await data.json());
  };

  return (
    <div>
      <Header accountId={user} />
      <div>
        {departments.map((department) => (
          <div key={department._id}>
            <button onClick={() => handleDepartmentClick(department._id)}>
              {department.name}
            </button>
          </div>
        ))}
      </div>
      <div>
        {majors.map((major) => (
          <Link to={`/posts?major=${encodeURI(major.name)}`} key={major._id}>
            <section>
              <h2>{major.name}</h2>
              <p>{major.description}</p>
            </section>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MajorsPage;
