import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DateSelector from "./DateSelector";
import { AppContextProvider } from "../../store/AppContext";

const AllOrders = () => {
  const [allBuyers, setAllBuyers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const dateCtx = useContext(AppContextProvider);

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
    navigate(`./`);
  };

  return (
    <>
      <div className="text-xl font-bold pb-4">See All Orders</div>
      <div className="flex">
        <div>
          <DateSelector />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded"
            onClick={handleDateSelect}
          >
            Filter
          </button>
        </div>
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
                      onClick={() => handleOrderClick(buyer.id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded"
                    >
                      View All
                    </button>
                  </td>
                  <td></td>
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
