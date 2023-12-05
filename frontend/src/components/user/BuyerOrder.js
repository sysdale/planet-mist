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
      await axios
        .get(`${process.env.REACT_APP_API_SCENTS}`)
        .then((response) => {
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
    console.log(scentsList);

    const filtered = scentsList.filter((scent) =>
      scent.attributes.name
        .toLowerCase()
        .toString()
        .includes(scentInput.name.toString().toLowerCase())
    );

    setFilteredList(filtered);
    setScentInput(initState);

    console.log(filteredList);
  };

  return (
    <>
      <h1>Select Scents</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Enter scent name"
          value={scentInput.name}
          onChange={handleChange}
        />
        <button type="submit">Search Scent</button>
      </form>

      {/* Scents table here */}
      <h1>Select List</h1>
      <ScentsTable data={filteredList} />
    </>
  );
};

export default BuyerOrder;
