import { createContext, useState } from "react";

export const AppContext = createContext({
  selectedDate: null,
  handleDate: (date) => {},
  isFiltered: false,
  handleFilter: () => {},
  user: null,
  loggedIn: false,
  jwtToken: null,
});

export const AppContextProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFiltered, setIsFiltered] = useState(false);
  const [quantities, setQuantities] = useState([]);

  const [user, setUser] = useState([]);
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [jwtToken, setJwtToken] = useState(localStorage.getItem("authToken"));

  const login = (user, role, token) => {
    setUser(user, role, token);
    setIsLoggedIn(true);
    setJwtToken(token);
    console.log(user);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("authToken");
    setJwtToken(null);
  };

  const handleDate = (date) => {
    setSelectedDate(date);
    console.log("Context", selectedDate);
  };

  const handleFilter = (status) => {
    setIsFiltered(status);
  };

  const handleQuants = (quants) => {
    setQuantities(quants);
  };

  return (
    <AppContext.Provider
      value={{
        selectedDate,
        handleDate,
        isFiltered,
        handleFilter,
        quantities,
        handleQuants,
        user,
        login,
        logout,
        loggedIn,
        jwtToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
