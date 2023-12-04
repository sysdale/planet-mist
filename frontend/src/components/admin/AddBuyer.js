import React from "react";
import axios from "axios";

import { useState, useEffect } from "react";
import TestAPI from "./TestAPI";

const API_ADD_BUYERS = "http://localhost:1337/api/buyers";
const initFields = { buyerName: "", email: "", password: "" };

function AddBuyer() {
  const [newBuyer, setNewBuyer] = useState(initFields);

  const [allBuyers, setAllBuyers] = useState([]);

  useEffect(() => {
    //TestAPI();
    fetchBuyer();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setNewBuyer(initFields);
    addBuyer();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBuyer((prevState) => ({ ...prevState, [name]: value }));
  };

  const fetchBuyer = async () => {
    try {
      await axios.get(API_ADD_BUYERS).then((response) => {
        setAllBuyers(response.data.data);
      });
    } catch (error) {
      console.log("Error fetching", error);
    }
  };

  const addBuyer = async () => {
    try {
      const payload = {
        data: {
          email: newBuyer.email,
          buyerName: newBuyer.buyerName,
          password: newBuyer.password,
        },
      };

      await axios
        .post("http://localhost:1337/api/buyers", payload)
        .then((response) => {
          console.log(response);
          fetchBuyer();
        });
    } catch (error) {
      console.log("Error adding", error);
    }
  };

  return (
    <div>
      <h1>Add Buyer</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Buyer Name</label>
          <input
            name="buyerName"
            type="text"
            placeholder="Enter name"
            value={newBuyer.buyerName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            name="email"
            type="text"
            placeholder="Enter email"
            value={newBuyer.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter password"
            value={newBuyer.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Add Buyer</button>
      </form>

      <div>
        {allBuyers.map((item) => {
          return <li key={item.id}>{item.attributes.buyerName}</li>;
        })}
      </div>
    </div>
  );
}

export default AddBuyer;
