import React, { useContext, useEffect, useState } from "react";
import ScentsTable from "./ScentsTable";
import { RxReset } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import qs from "qs";
import { format } from "date-fns";
import { AppContext } from "../../store/AppContext";
import "react-toastify/dist/ReactToastify.css";

const query = qs.stringify(
  {
    populate: ["SKU_fk"],
  },

  {
    encodeValuesOnly: true,
  }
);

const initState = {
  name: "",
};

const typeMap = {
  name: "string",
  sku: "number",
};

const dateFormat = "yyyy-MM-dd";
const formattedDate = format(new Date(), dateFormat);

const showToastMessage = () => {
  toast.success("Order Successfully Added!", {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
    toastId: "sxs1",
  });
};

const BuyerOrder = () => {
  const [scentInput, setScentInput] = useState(initState);
  const [scentsList, setScentsList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [transformedOrder, setTransformedOrder] = useState([]);
  const navigate = useNavigate();

  const { quantities } = useContext(AppContext);
  const { id } = useParams();

  useEffect(() => {
    const getAllScents = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_SCENTDATAS}?${query}`
        );

        setScentsList(response.data.data);
        setFilteredList(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getAllScents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setScentInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearchReset = () => {
    setScentInput(initState);
    setFilteredList(scentsList);
  };

  const handleSearch = (event) => {
    let filtered = [];

    if (typeMap[event] === "string") {
      filtered = scentsList.filter((scent) =>
        scent.attributes.SKU_fk.data.attributes.name
          .toLowerCase()
          .toString()
          .includes(scentInput.name.toString().toLowerCase())
      );
    } else if (typeMap[event] === "number") {
      filtered = scentsList.filter(
        (scent) => scent.attributes.SKU_fk.data.id === parseInt(scentInput.name)
      );
    }

    setFilteredList(filtered);
    setScentInput(initState);
  };

  const handleNewOrder = (e) => {
    e.preventDefault();

    const transformedOrder = Object.keys(quantities).flatMap((sku) => {
      return Object.keys(quantities[sku])
        .filter((key) => !isNaN(Number(key)))
        .map((scentID) => ({
          quantity: quantities[sku][scentID],
          scentID_fk: {
            id: Number(scentID),
          },
        }));
    });

    setTransformedOrder({
      order_details: {
        data: transformedOrder,
      },
    });

    console.log(transformedOrder);

    const payload = {
      date: formattedDate,
      buyerID_fk: 3,
      detailsArray: transformedOrder,
    };

    try {
      axios
        .post(process.env.REACT_APP_API_POSTORDER, payload)
        .then((response) => {
          console.log(response);
        });
    } catch (e) {
      console.error(e);
    }
    showToastMessage();
  };

  return (
    <>
      <div className="text-xl font-bold pb-4">Select Scents</div>

      <div className="flex">
        <div className="p-2">
          <RxReset onClick={handleSearchReset} />
        </div>
        <div>
          <input
            className="bg-gray-100 py-2 px-4"
            name="name"
            type="text"
            placeholder="Enter scent name/SKU"
            value={scentInput.name}
            onChange={handleChange}
          />
        </div>
      </div>

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
          onClick={handleNewOrder}
        >
          Place Order
        </button>
        <ToastContainer />
      </div>
    </>
  );
};

export default BuyerOrder;
