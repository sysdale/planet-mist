import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Login = () => {
  const initFields = { username: "", password: "" };
  const [credentials, setCredentials] = useState(initFields);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(credentials);

    const payload = {
      identifier: credentials.username,
      password: credentials.password,
    };

    axios
      .post("http://localhost:1337/api/auth/local", payload)
      .then((response) => {
        // Handle success.
        console.log("User profile", response.data.user.id);
        console.log("User token", response.data.jwt);
        navigate(`/buyer/${response.data.user.id}`, {
          state: { buyerID: response.data.user.id },
        });
      })
      .catch((error) => {
        // Handle error.
        console.log("An error occurred:", error.response);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="text-xl font-bold pb-4">Buyer Login</div>

      <form onSubmit={handleSubmit}>
        <div className="flex-col">
          <label className="font-semibold">Username</label>
          <div>
            <input
              name="username"
              type="text"
              placeholder="Enter username"
              value={credentials.username}
              className="border-2 border-slate-500"
              onChange={handleChange}
            />
          </div>

          <label className="font-semibold">Password</label>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              value={credentials.password}
              className="border-2 border-slate-500"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="pt-3">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login
          </button>
          <ToastContainer />
        </div>
      </form>
    </div>
  );
};

export default Login;
