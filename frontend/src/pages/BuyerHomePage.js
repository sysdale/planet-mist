import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const BuyerHomePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const pastOrders = () => {
    navigate(`./pastorders`);
  };

  const placeOrder = () => {
    navigate(`./placeorder`);
  };

  return (
    <>
      {console.log(window.location.href)}
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-center">
          <div className="m-5">
            <button
              className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={pastOrders}
            >
              Past Orders
            </button>
          </div>

          <div className="m-5">
            <button
              className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
