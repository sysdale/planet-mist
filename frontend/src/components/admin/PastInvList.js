import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DateSelector from "./DateSelector";
import { AppContext } from "../../store/AppContext";
import { format } from "date-fns";

const PastInvList = () => {
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

  const handleInvoiceClick = (buyerID) => {
    navigate(`./${buyerID}`);
  };

  return (
    <>
      <div className="text-xl font-bold pb-4">See Today's Invoices</div>

      {isLoading ? (
        <p>Please wait ... Fetching Today's Invoices</p>
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
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded"
                      onClick={() => handleInvoiceClick(buyer.id)}
                    >
                      View
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

export default PastInvList;
