import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const navAdmin = () => {
    navigate("/admin");
  };

  const navBuyer = () => {
    navigate("/buyer");
  };

  return (
    <>
      <div>
        <button onClick={navAdmin}>Admin Dashboard</button>
      </div>
      <div>
        <button onClick={navBuyer}>Buyer Dashboard</button>
      </div>
    </>
  );
};

export default HomePage;
