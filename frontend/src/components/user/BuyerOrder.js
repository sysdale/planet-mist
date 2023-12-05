import React, { useEffect, useState } from "react";
import ScentsTable from "./ScentsTable";
import axios from "axios";

const initState = {
  name: "",
};

const BuyerOrder = () => {
  const [scentInput, setScentInput] = useState(initState);
  const [scentsList, setScentsList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    getAllScents();
  }, []);

  const getAllScents = async () => {
    try {
      await axios.get(process.env.REACT_APP_API_SCENTS).then((response) => {
        setScentsList(response.data.data);
        setFilteredList(response.data.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setScentInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const filtered = scentsList.filter((scent) =>
      scent.attributes.name
        .toLowerCase()
        .toString()
        .includes(scentInput.name.toString().toLowerCase())
    );

    setFilteredList(filtered);
    setScentInput(initState);
  };

  return (
    <>
      <div className="text-xl font-bold">Select Scents</div>
      <form onSubmit={handleSubmit}>
        <input
          className="bg-gray-100 py-2 px-4"
          name="name"
          type="text"
          placeholder="Enter scent name/SKU"
          value={scentInput.name}
          onChange={handleChange}
        />
        <div className="space-x-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
            type="submit"
          >
            Search Scent
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
            type="submit"
          >
            Search Scent
          </button>
        </div>
      </form>

      {/* Scents table here */}
      <div className="pt-10">
        <ScentsTable data={filteredList} />
      </div>
    </>
  );
};

export default BuyerOrder;
