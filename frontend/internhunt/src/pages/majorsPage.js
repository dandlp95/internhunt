import React, { useEffect, useState } from "react";
import FetchCalls from "../utils/fetchCalls";
import getLocalStorage from "../utils/getLocalStorage";
import Header from "../components/header";
import Footer from "../components/footer";

const MajorsPage = () => {
  const [majors, setMajors] = useState([]);

  useEffect(() => {
    const getMajors = async () => {
      const fetchData = new FetchCalls(
        "/majors",
        "GET",
        getLocalStorage("userData").jwt
      );
      const data = await fetchData.publicGet();
      setMajors(await data.json());
    };
    getMajors();
  }, []);

  return (
    <div>
      {majors.map((major) => (
        <section>
          <h2>{major.name}</h2>
          <p>major description will go here...</p>
        </section>
      ))}
    </div>
  );
};

export default MajorsPage;
