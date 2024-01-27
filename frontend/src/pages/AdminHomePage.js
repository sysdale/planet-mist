import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminHomePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleAddCustomer = () => {
    navigate("addbuyer");
  };
  const handlePreviousOrders = (second) => {
    navigate("allorders");
  };
  const handleTodayOrders = (second) => {
    navigate("todaysorders");
  };
  const handleInvoices = (second) => {
    navigate("invoices");
  };
  const handleMasterTable = (second) => {
    navigate("mastertable");
  };

  const status = localStorage.getItem("username");

  return (
    <>
      {status === "admin" ? (
        <div className="flex flex-col">
          <div className="flex flex-col items-center justify-center">
            <div className="m-5">
              <button
                className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleAddCustomer}
              >
                Add Customer
              </button>
            </div>

            <div className="m-5">
              <button
                className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleTodayOrders}
              >
                Today's Orders
              </button>
            </div>

            <div className="m-5">
              <button
                className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handlePreviousOrders}
              >
                Past Orders
              </button>
            </div>

            <div className="m-5">
              <button
                className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleInvoices}
              >
                Invoices
              </button>
            </div>

            <div className="m-5">
              <button
                className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleMasterTable}
              >
                Master Table
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-2xl font-extrabold">You are not</p>
      )}
    </>
  );
};

export default AdminHomePage;
