import React, { useEffect, useState } from "react";
import ScentsTable from "./ScentsTable";
import { useNavigate, useParams } from "react-router-dom";
import qs from "qs";
import axios from "axios";

const initState = {
  name: "",
};

const typeMap = {
  name: "string",
  sku: "number",
};

const BuyerOrder = () => {
  const [scentInput, setScentInput] = useState(initState);
  const [scentsList, setScentsList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const getAllScents = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_SCENTS);
        setScentsList(response.data.data);
        setFilteredList(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    const PushOrder = async () => {
      const newOrderData = {
        data: {
          date: "2010-12-08",
          buyerID_fk: {
            id: 3,
          },
          order_details: {
            data: {
              quantity: 12,
              scentID_fk: {
                id: 6,
              },
            },
          },
        },
      };

      try {
        const response = await axios.post(
          process.env.REACT_APP_API_ORDERS,
          newOrderData
        );
        console.log(response);
      } catch (e) {
        console.error(e);
      }
    };

    getAllScents();
    //PushOrder();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setScentInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearch = (event) => {
    let filtered = [];

    if (typeMap[event] === "string") {
      filtered = scentsList.filter((scent) =>
        scent.attributes.name
          .toLowerCase()
          .toString()
          .includes(scentInput.name.toString().toLowerCase())
      );
    } else if (typeMap[event] === "number") {
      filtered = scentsList.filter(
        (scent) => scent.id === parseInt(scentInput.name)
      );
    }

    setFilteredList(filtered);
    setScentInput(initState);
  };

  return (
    <>
      <div className="text-xl font-bold pb-4">Select Scents</div>

      <input
        className="bg-gray-100 py-2 px-4"
        name="name"
        type="text"
        placeholder="Enter scent name/SKU"
        value={scentInput.name}
        onChange={handleChange}
      />

      {/* Search functionality */}
      <div className="space-x-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
          onClick={() => handleSearch("name")}
        >
          Search by Name
        </button>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
          onClick={() => handleSearch("sku")}
        >
          Search by SKU
        </button>
      </div>

      {/* Scents table here */}
      <div className="pt-10">
        {isLoading ? (
          <p>Loading ... Please Wait</p>
        ) : (
          <ScentsTable data={filteredList} />
        )}
      </div>

      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
          onClick={() => handleSearch("sku")}
        >
          Place Order
        </button>
      </div>
    </>
  );
};

export default BuyerOrder;
