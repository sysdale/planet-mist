import React, { useEffect, useState } from "react";
import { startOfMonth, addDays, format } from "date-fns";
import { Navigate, useNavigate } from "react-router-dom";

const TenDayInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    generateInvoices();
  }, []);

  const handleInvoiceButton = (id, startDate, endDate) => {
    navigate(`./${id}`, { state: { dateFilter: { startDate, endDate } } });
  };

  const generateInvoices = () => {
    const today = new Date();
    const firstDayOfMonth = startOfMonth(today);
    let invoiceDates = [];

    for (let i = 0; i < 3; i++) {
      const startDate = addDays(firstDayOfMonth, i * 10);
      const endDate = addDays(startDate, 9);

      const newInvoice = {
        id: i + 1,
        startDate,
        endDate,
      };

      invoiceDates.push(newInvoice);
    }

    setInvoices(invoiceDates);
    console.log(invoiceDates);
  };

  return (
    <>
      <div className="flex-col">
        <div className="flex flex-col items-center justify-center">
          <div className="font-bold text-2xl">List of Invoices</div>

          {invoices.map((invoice) => (
            <div key={invoice.id} className="py-3">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() =>
                  handleInvoiceButton(
                    invoice.id,
                    invoice.startDate,
                    invoice.endDate
                  )
                }
              >
                {`#${invoice.id} : ${format(
                  invoice.startDate,
                  "MMMM d"
                )} - ${format(invoice.endDate, "MMMM d")}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TenDayInvoice;
