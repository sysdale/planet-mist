import React from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

const BuyerHomePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const pastOrders = () => {
    navigate(`/buyer/${id}/pastorders`);
  };

  const placeOrder = () => {
    navigate(`/buyer/${id}/placeorder`);
  };

  return (
    <>
      {console.log(window.location.href)}
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div className="m-5">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={pastOrders}
            >
              Past Orders
            </button>
          </div>

          <div className="m-5">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={placeOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyerHomePage;
