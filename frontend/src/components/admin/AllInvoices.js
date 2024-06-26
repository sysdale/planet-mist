import axios from "axios";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const AllInvoices = () => {
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

  const handleInvoiceClick = (buyerID) => {
    const url = `./${buyerID}`;
    navigate(url, { state: { buyerID } });
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
                      className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold p-1 rounded"
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
    </div>
  );
};

export default AllInvoices;
