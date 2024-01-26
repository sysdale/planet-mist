import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DateSelector from "./DateSelector";
import { AppContext } from "../../store/AppContext";
import { format } from "date-fns";

const AllOrders = () => {
  const [allBuyers, setAllBuyers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const { selectedDate, handleFilter, isFiltered } = useContext(AppContext);

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
    if (isFiltered) {
      const url = `./${buyerID}/filter`;

      //creating date format
      const dateFormat = "yyyy-MM-dd";
      const formattedDate = format(selectedDate, dateFormat);

      navigate(url, { state: { buyerID, dateFilter: formattedDate } });
    } else {
      navigate(`./${buyerID}`);
    }
  };

  const handleDateSelect = () => {
    console.log(selectedDate);
    handleFilter(true);
  };

  const handleClearSelect = () => {
    handleFilter(false);
    console.log(isFiltered);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="text-xl font-bold pb-4">See All Orders</div>
      <div className="flex">
        <div>
          <DateSelector />
          <button
            className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold p-1 rounded"
            onClick={handleDateSelect}
          >
            Set Date
          </button>

          <button
            className={`${
              isFiltered ? "bg-green-500" : "bg-[#0058a3]"
            }  text-white font-bold p-1 rounded`}
            onClick={handleClearSelect}
          >
            Clear Filter
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
                      className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold p-1 rounded"
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
    </div>
  );
};

export default AllOrders;
