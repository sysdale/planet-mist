import axios from "axios";
import React, { useEffect, useState } from "react";
import ScentsTable from "./ScentsTable";
const API_GET_SCENTS = "http://localhost:1337/api/scent-lists";

const initState = {
  name: "",
};

const BuyerOrder = () => {
  const [scentInput, setScentInput] = useState(initState);
  const [scentsList, setScentsList] = useState([]);

  useEffect(() => {
    getAllScents();
  }, []);

  const getAllScents = async () => {
    try {
      await axios.get(API_GET_SCENTS).then((response) => {
        setScentsList(response.data.data);
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
    setScentInput(initState);
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
      <ScentsTable data={scentsList} />
      {console.log(scentsList)}
    </>
  );
};

export default BuyerOrder;
