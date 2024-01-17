import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AppContextProvider } from "./store/AppContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
