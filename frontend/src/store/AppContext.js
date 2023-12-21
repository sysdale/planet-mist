import { createContext, useState } from "react";

export const AppContext = createContext({
  selectedDate: null,
  handleDate: (date) => {},
  isFiltered: false,
  handleFilter: () => {},
});

export const AppContextProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFiltered, setIsFiltered] = useState(false);
  const [quantities, setQuantities] = useState([]);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
