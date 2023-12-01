import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

const API_ADD_BUYERS = "http://localhost:1337/api/buyers";
const initFields = { buyerName: "", email: "", password: "" };

function AddBuyer() {
  const [newBuyer, setNewBuyer] = useState(initFields);

  const [allBuyers, setAllBuyers] = useState([]);

  useEffect(() => {
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
        console.log(response.data);
      });
    } catch (error) {
      console.log("Error fetching", error);
    }
  };

  const addBuyer = async () => {
    try {
      await axios.post(API_ADD_BUYERS, { data: newBuyer }).then((response) => {
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
