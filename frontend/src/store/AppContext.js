import { createContext, useState } from "react";
import { parseISO } from "date-fns";

export const AppContext = createContext({
  selectedDate: null,
  handleDate: (date) => {},
});

export const AppContextProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState();

  const handleDate = (date) => {
    setSelectedDate(date);
    console.log(date.toLocaleString("en-UK"));
  };

  return (
    <AppContext.Provider value={{ selectedDate, handleDate }}>
      {children}
    </AppContext.Provider>
  );
};
