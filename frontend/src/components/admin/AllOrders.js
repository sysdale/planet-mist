import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PastOrders from "../user/PastOrders";

const AllOrders = () => {
  const DateSelector = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [dateSelected, setDateSelected] = useState(false);

    return (
      <div>
        <div className="font-medium">Select Date</div>
        <DatePicker
          showIcon
          selected={startDate}
          maxDate={new Date()}
          onChange={(date) => setStartDate(date)}
          dateFormat="dd-MM-yyyy"
        />
      </div>
    );
  };

  const [allBuyers, setAllBuyers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuyer = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_BUYERS);
        setAllBuyers(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching", error);
      }
    };

    fetchBuyer();
  }, []);

  const handleOrderClick = (buyerID) => {
    navigate(`./${buyerID}`);
  };

  const handleDateSelect = (buyerID) => {
    navigate(`./${buyerID}`);
  };

  return (
    <>
      <div className="text-xl font-bold pb-4">See All Orders</div>
      <div className="flex">
        <DateSelector />
      </div>

      {isLoading ? (
        <p>Please wait ... Fetching Buyers List</p>
      ) : (
        <>
          <table className="table-auto text-center border-separate py-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Overall Count</th>
              </tr>
            </thead>
            <tbody>
              {allBuyers.map((buyer) => (
                <tr key={buyer.id}>
                  <td>{buyer.id}</td>
                  <td>{buyer.attributes.buyerName}</td>
                  <td>
                    <button
                      className="bg-slate-200"
                      onClick={() => handleOrderClick(buyer.id)}
                    >
                      13
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDateSelect(buyer.id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded"
                    >
                      Filter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default AllOrders;
