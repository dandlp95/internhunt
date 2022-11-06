import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FetchCalls from "../utils/fetchCalls";
import getLocalStorage from "../utils/getLocalStorage";
import Header from "../components/header";
import Footer from "../components/footer";

const MajorsPage = () => {
  const [majors, setMajors] = useState([]);
  const [departments, setDepartments] = useState([]);

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

  useEffect(() => {
    getMajors();
    getByDepartments();
  }, []);

  const handleDepartmentClick = async (departmentId) => {
    const fetchData = new FetchCalls(
      `/majors/getByDepartment/${departmentId}`,
      "GET"
    );
    const data = await fetchData.publicGet();
    setMajors(await data.json());
  };

  return (
    <div>
      <div>
        {departments.map((department) => (
          <div>
            <button onClick={() => handleDepartmentClick(department._id)}>
              {department.name}
            </button>
          </div>
        ))}
      </div>
      <div>
        {majors.map((major) => (
          <Link to={"/posts"}>
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
