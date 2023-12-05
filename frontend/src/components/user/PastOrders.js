import React from "react";
import pastOrdersAPI from "../apis/pastOrdersAPI";

const PastOrders = () => {
  pastOrdersAPI();
  return (
    <>
      <div className="text-xl font-bold">Order History</div>
    </>
  );
};

export default PastOrders;
