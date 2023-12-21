import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Login = () => {
  const initFields = { email: "", password: "" };
  const [credentials, setCredentials] = useState(initFields);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(credentials);

    const payload = {
      data: {
        email: credentials.email,
        password: credentials.password,
      },
    };

    axios
      .post(process.env.REACT_APP_API_BUYERS, payload)
      .then((response) => {
        console.log(response.data.user);
        console.log(response.data.jwt);
      })
      .catch((error) => {
        console.log("An error occurred!", error.response);
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
          <label>Email</label>
          <div>
            <input
              name="email"
              type="text"
              placeholder="Enter email"
              value={credentials.email}
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
