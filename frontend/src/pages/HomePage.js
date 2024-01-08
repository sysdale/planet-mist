import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const navAdmin = () => {
    navigate("/admin");
  };

  const navBuyer = () => {
    navigate("/buyer/3");
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div className="m-5">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={navAdmin}
            >
              Admin Dashboard
            </button>
          </div>

          <div className="m-5">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={navBuyer}
            >
              Buyer Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
