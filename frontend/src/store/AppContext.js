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

  const handleDate = (date) => {
    setSelectedDate(date);
    console.log("Context", selectedDate);
  };

  const handleFilter = (status) => {
    setIsFiltered(status);
  };

  return (
    <AppContext.Provider
      value={{ selectedDate, handleDate, isFiltered, handleFilter }}
    >
      {children}
    </AppContext.Provider>
  );
};
