import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DateSelector from "./DateSelector";
import { AppContext } from "../../store/AppContext";
import { format } from "date-fns";

const TodaysOrders = () => {
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
    const url = `./${buyerID}`;

    //creating date format
    const dateFormat = "yyyy-MM-dd";
    const formattedDate = format(new Date(), dateFormat);
    console.log(formattedDate);

    navigate(url, { state: { buyerID, dateFilter: formattedDate } });
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
      <div className="text-2xl font-bold pb-4">See Today's Orders</div>

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
                  <td className="p-2">{buyer.id}</td>
                  <td className="p-2">{buyer.attributes.buyerName}</td>
                  <td className="p-2">
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

export default TodaysOrders;
