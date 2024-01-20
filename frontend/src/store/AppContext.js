import { createContext, useState } from "react";

export const AppContext = createContext({
  selectedDate: null,
  handleDate: (date) => {},
  isFiltered: false,
  handleFilter: () => {},
  user: null,
  loggedIn: false,
  jwtToken: null,
  buyerName: null,
});

export const AppContextProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFiltered, setIsFiltered] = useState(false);
  const [quantities, setQuantities] = useState([]);
  const [buyerName, setBuyerName] = useState();

  const [user, setUser] = useState(
    { id: localStorage.getItem("userId") } || null
  );
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [jwtToken, setJwtToken] = useState(
    localStorage.getItem("authToken") || null
  );

  const login = (user, role, token) => {
    setUser(user, role, token);
    setIsLoggedIn(true);
    setJwtToken(token);
    console.log(user);

    localStorage.setItem("loginStatus", true);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("username", user.username);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("loginStatus");
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

  const handleBuyerName = (bName) => {
    setBuyerName(bName);
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
        buyerName,
        handleBuyerName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
