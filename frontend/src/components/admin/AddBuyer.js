import React from "react";
import axios from "axios";

import { useState, useEffect } from "react";

const initFields = { buyerName: "", email: "", password: "" };

function AddBuyer() {
  const [newBuyer, setNewBuyer] = useState(initFields);
  const [allBuyers, setAllBuyers] = useState([]);

  useEffect(() => {
    // fetchBuyer();
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
      await axios.get(process.env.REACT_APP_API_BUYERS).then((response) => {
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
        .post(process.env.REACT_APP_API_BUYERS, payload)
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
      <div className="text-xl font-bold pb-4">Add New Buyer</div>

      <form onSubmit={handleSubmit}>
        <div className="flex-col">
          <label>Buyer Name</label>
          <div className="">
            <input
              name="buyerName"
              type="text"
              placeholder="Enter name"
              value={newBuyer.buyerName}
              className="border-2 border-slate-500"
              onChange={handleChange}
            />
          </div>

          <label>Email</label>
          <div>
            <input
              name="email"
              type="text"
              placeholder="Enter email"
              value={newBuyer.email}
              className="border-2 border-slate-500"
              onChange={handleChange}
            />
          </div>

          <label>Password</label>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              value={newBuyer.password}
              className="border-2 border-slate-500"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="pt-3">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Buyer
          </button>
        </div>
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
