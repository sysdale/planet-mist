import React from "react";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initFields = {
  buyerName: "",
  email: "",
  password: "",
  confirmPassword: "",
  group: 20,
};

function AddBuyer() {
  const [newBuyer, setNewBuyer] = useState(initFields);
  const [allBuyers, setAllBuyers] = useState([]);
  const [isNameValid, setIsNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isGroupValid, setIsGroupValid] = useState(true);
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(true);

  const showToastMessage = () => {
    toast.success("Buyer Successfully Added!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isGroupValid &&
      isPasswordConfirmed
    ) {
      setNewBuyer(initFields);
      addBuyer();
      showToastMessage();
    } else {
      toast.error("Please fill all fields correctly");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Perform validation based on the input field
    switch (name) {
      case "buyerName":
        setIsNameValid(value.trim() !== "");
        break;
      case "email":
        setIsEmailValid(/^\S+@\S+\.\S+$/.test(value)); // Basic email validation
        break;
      case "password":
        setIsPasswordValid(value.trim() !== "" && value.length >= 6);
        setIsPasswordConfirmed(false); // Reset confirmation on password change
        break;
      case "confirmPassword":
        setIsPasswordConfirmed(value === newBuyer.password);
        break;
      case "group":
        setIsGroupValid(value === "16" || value === "20ML");
        break;
      default:
        break;
    }

    // Update state
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
    const payload = {
      data: {
        email: newBuyer.email,
        buyerName: newBuyer.buyerName,
        password: newBuyer.password,
        group: newBuyer.group,
      },
    };

    const usersPayload = {
      email: newBuyer.email,
      username: newBuyer.buyerName,
      password: newBuyer.password,
      role: "authenticated",
    };

    try {
      await axios
        .post(process.env.REACT_APP_API_BUYERS, payload)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log("An error occurred:", error.response);
        });
    } catch (error) {
      console.log("Error adding", error);
    }

    try {
      axios
        .post("http://localhost:1337/api/auth/local/register", usersPayload)
        .then((response) => {
          console.log("User profile", response.data.user);
          console.log("User token", response.data.jwt);
        });
    } catch (error) {
      console.log("Error adding", error);
    }
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
      <div className="text-xl font-bold pb-4">Add New Buyer</div>

      <form onSubmit={handleSubmit}>
        <div className="flex-col">
          <div className="font-semibold">Buyer Name</div>
          <div>
            <input
              name="buyerName"
              type="text"
              required
              placeholder="Enter name"
              value={newBuyer.buyerName}
              className={`border-2 border-slate-500 ${
                isNameValid ? "" : "border-red-500"
              }`}
              onChange={handleChange}
            />
            {!isNameValid && (
              <p className="text-red-500">Please enter a valid name</p>
            )}
          </div>

          <div className="font-semibold">Email</div>
          <div>
            <input
              name="email"
              type="text"
              required
              placeholder="Enter email"
              value={newBuyer.email}
              className={`border-2 border-slate-500 ${
                isEmailValid ? "" : "border-red-500"
              }`}
              onChange={handleChange}
            />
            {!isEmailValid && (
              <p className="text-red-500">Please enter a valid email</p>
            )}
          </div>

          <div className="font-semibold">Password</div>
          <div>
            <input
              name="password"
              type="password"
              required
              placeholder="Enter password"
              value={newBuyer.password}
              className={`border-2 border-slate-500 ${
                isPasswordValid ? "" : "border-red-500"
              }`}
              onChange={handleChange}
            />
            {!isPasswordValid && (
              <p className="text-red-500">
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          <div className="font-semibold">Confirm Password</div>
          <div>
            <input
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm password"
              className={`border-2 border-slate-500 ${
                isPasswordConfirmed ? "" : "border-red-500"
              }`}
              onChange={handleChange}
            />
            {!isPasswordConfirmed && (
              <p className="text-red-500">Passwords do not match</p>
            )}
          </div>

          <div className="font-semibold">ML Group</div>
          <div className="flex items-center">
            <label className="mr-4">
              <input
                type="radio"
                name="group"
                value="16"
                checked={newBuyer.group === "16"}
                onChange={handleChange}
              />
              16ML
            </label>
            <label>
              <input
                type="radio"
                name="group"
                value="20ML"
                checked
                onChange={handleChange}
              />
              20ML
            </label>
          </div>
        </div>

        <div className="pt-3">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Buyer
          </button>
          <ToastContainer />
        </div>
      </form>
    </div>
  );
}

export default AddBuyer;
