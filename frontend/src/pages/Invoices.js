import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Invoices = () => {
  const navigate = useNavigate();

  const handleTodayInvoice = (second) => {
    navigate(`today`);
  };
  const handlePastInvoice = (second) => {
    navigate(`past`);
  };

  const handleAllInvoice = (second) => {
    navigate("allinvoice");
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-center">
          <div className="m-5">
            <button
              className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleTodayInvoice}
            >
              Today's Invoices
            </button>
          </div>

          <div className="m-5">
            <button
              className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handlePastInvoice}
            >
              10-Day Invoices
            </button>
          </div>

          <div className="m-5">
            <button
              className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleAllInvoice}
            >
              All Invoices
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoices;
