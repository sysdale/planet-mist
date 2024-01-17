import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useContext } from "react";
import { AppContext } from "../../store/AppContext";
import qs from "qs";
import "react-toastify/dist/ReactToastify.css";

const query = qs.stringify(
  {
    populate: "*",
  },
  {
    encodeValuesOnly: true,
  }
);

const showToastMessage = () => {
  toast.error("Invalid Login Details", {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
  });
};

const Login = () => {
  const initFields = { username: "", password: "" };
  const [credentials, setCredentials] = useState(initFields);
  const { login, jwtToken } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, [jwtToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(credentials);
    //setCredentials(initFields);

    const payload = {
      identifier: credentials.username,
      password: credentials.password,
    };

    axios
      .post(`http://localhost:1337/api/auth/local`, payload)
      .then((response) => {
        localStorage.setItem("authToken", response.data.jwt);

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.jwt}`;

        //console.log(axios.defaults.headers.common);

        login(
          response.data.user,
          response.data.user.username === "admin" ? "admin" : "authenticated",
          response.data.jwt
        );

        // Navigate based on user type
        navigate(
          response.data.user.username === "admin"
            ? "/admin"
            : `/buyer/${response.data.user.id}`,
          { replace: true }
        );
      })
      .catch((error) => {
        // Handle error.
        if (error.response?.status === 400) {
          showToastMessage();
        }
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
