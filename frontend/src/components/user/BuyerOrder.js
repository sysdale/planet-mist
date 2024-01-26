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
//console.log(formattedDate);

const showToastMessage = () => {
  toast.success(
    "Order Placed. You are only allowed 1 Order per day. Thank you!",
    {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
      toastId: "sxs1",
    }
  );
};

const showErrorMessage = () => {
  toast.error("Invalid Order! Kindly add some scents to order", {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
    toastId: "sxs2",
  });
};

const BuyerOrder = () => {
  const { user } = useContext(AppContext);

  const [scentInput, setScentInput] = useState(initState);
  const [scentsList, setScentsList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [transformedOrder, setTransformedOrder] = useState([]);
  const [orderDone, setOrderDone] = useState(
    localStorage.getItem("orderDone") ? "true" : false
  );
  const [masterTableData, setMasterTableData] = useState([]);
  const navigate = useNavigate();

  const { quantities } = useContext(AppContext);
  //const { id } = useParams();

  useEffect(() => {
    const getAllScents = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_SCENTDATAS}?${query}`
        );

        setScentsList(response.data.data);
        setFilteredList(response.data.data);
        setIsLoading(false);
        setOrderDone(localStorage.getItem("orderDone") || false);
        //console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getMasterTable = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_MASTERTABLE}?${query}`
        );

        setMasterTableData(response.data.data);
        //console.log(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getAllScents();
    getMasterTable();
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
    setOrderDone(localStorage.setItem("orderDone", true));
    setOrderDone(true);

    const transformedOrder = Object.keys(quantities).flatMap((sku) => {
      return Object.keys(quantities[sku])
        .filter((key) => !isNaN(Number(key)))
        .map((scentID) => {
          const masterTableRow = masterTableData.find(
            (row) => row.attributes.SKU_fk.data.id === parseInt(sku)
          );

          // Find the corresponding entry in scentsList
          const scentEntry = scentsList.find(
            (scent) => scent.id === parseInt(scentID)
          );

          if (masterTableRow && scentEntry) {
            const price =
              (masterTableRow.attributes.costEveryVisit /
                masterTableRow.attributes.purchasedML) *
              scentEntry.attributes.milliLts;

            return {
              quantity: quantities[sku][scentID],
              scentID_fk: {
                id: Number(scentID),
              },
              price: price,
            };
          } else {
            // Handle the case where either masterTableRow or scentEntry is not found
            return null;
          }
        });
    });

    // Remove null entries if any
    const validTransformedOrder = transformedOrder.filter(Boolean);
    //console.log(validTransformedOrder);

    setTransformedOrder({
      order_details: {
        data: validTransformedOrder,
      },
    });

    //console.log(validTransformedOrder);

    const payload = {
      date: formattedDate,
      buyerID_fk: user.id,
      detailsArray: transformedOrder,
    };

    //console.log(payload);
    if (validTransformedOrder.length > 0) {
      try {
        axios
          .post(process.env.REACT_APP_API_POSTORDER, payload)
          .then((response) => {
            //console.log(response);
            showToastMessage();
          });
      } catch (e) {
        console.error(e);
      }
    } else {
      showErrorMessage();
    }

    setTimeout(() => {
      navigate(`/buyer/${user.id}/pastorders`);
    }, 6000);

    //navigate(`/buyer/${user.id}/pastorders`);
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
      <div className="text-xl font-bold pb-4">Place Order</div>

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
      <div className="space-x-2 pt-3">
        <button
          className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
          onClick={() => handleSearch("name")}
        >
          Search by Name
        </button>

        <button
          className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
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

      <div className="pb-10">
        <button
          className={`${
            orderDone
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#0058a3] hover:bg-blue-700"
          } text-white font-bold py-2 px-2 rounded`}
          onClick={handleNewOrder}
          //disabled={orderDone ? true : false}
        >
          Place Order
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default BuyerOrder;
