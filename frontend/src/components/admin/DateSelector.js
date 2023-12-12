import { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AppContext } from "../../store/AppContext";

const DateSelector = () => {
  const { selectedDate, handleDate } = useContext(AppContext);

  return (
    <>
      <div className="font-medium">Select Date</div>
      <DatePicker
        showIcon
        selected={selectedDate}
        maxDate={new Date()}
        onChange={(date) => handleDate(date)}
        showTimeSelect={false}
        dateFormat="dd-MM-yyyy"
      />
    </>
  );
};

export default DateSelector;
