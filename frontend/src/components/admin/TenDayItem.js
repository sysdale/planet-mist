import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import qs from "qs";
import { addDays, startOfMonth, isAfter, format, parseISO } from "date-fns";

const query = qs.stringify(
  {
    populate: {
      orders: {
        populate: {
          order_details: {
            populate: {
              scentID_fk: {
                populate: ["SKU_fk"],
              },
            },
          },
        },
      },
    },
  },
  {
    encodeValuesOnly: true,
  }
);

const formatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

const TenDayItem = () => {
  const { state } = useLocation();
  const buyerID = state?.buyerID || null;
  const dateFilter = state?.dateFilter || null;

  const dateFormat = "yyyy-MM-dd";
  const dateInvoiceFormat = "dd MMMM yyyy";

  const [fmtStartDate, setFmtStartDate] = useState(
    format(dateFilter.startDate, dateFormat)
  );
  const [fmtEndDate, setfmtEndDate] = useState(
    format(dateFilter.endDate, dateFormat)
  );

  //console.log(fmtStartDate, fmtEndDate);

  const { id } = useParams() || { id: buyerID };

  const [pastOrders, setPastOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processedData, setProcessedData] = useState([]);
  const [showInvoicesPressed, setShowInvoicesPressed] = useState(false);

  let orderCount = 0;

  const calculateSubtotal = (detail) => {
    const quantity = detail.quantity || 0;
    const price = detail.price || 0;
    const ethanol = {
      2: 7,
      16: 30,
      20: 50,
    };

    return quantity * price;
  };

  // Calculate totals for all invoices
  console.log(processedData);

  const totalOrderCountInvoices = processedData.length;

  const totalQuantitiesAllInvoices = processedData.reduce(
    (total, processedObject) => {
      Object.keys(processedObject).forEach((skuID) => {
        processedObject[skuID].details.forEach((detail) => {
          total += detail.quantity || 0;
        });
      });
      return total;
    },
    0
  );

  const totalEthanolCostAllInvoices = processedData.reduce(
    (total, processedObject) => {
      Object.keys(processedObject).forEach((skuID) => {
        processedObject[skuID].details.forEach((detail) => {
          total += (detail.ethanol[detail.ml] || 0) * (detail.quantity || 0);
        });
      });
      return total;
    },
    0
  );

  const totalScentsBillAllInvoices = processedData.reduce(
    (total, processedObject) => {
      Object.keys(processedObject).forEach((skuID) => {
        processedObject[skuID].details.forEach((detail) => {
          total += calculateSubtotal(detail);
        });
      });
      return total;
    },
    0
  );

  const totalOverallAmountToInvoice =
    totalScentsBillAllInvoices + totalEthanolCostAllInvoices;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BUYERS}/${id}?${query}`
        );
        setPastOrders(response.data.data);
        const transformed = processOrderData(
          response.data.data,
          fmtStartDate,
          fmtEndDate
        );
        setProcessedData(transformed);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processOrderData = (data, startDate, endDate) => {
    const processedOrders = [];

    data.attributes.orders.data.forEach((order) => {
      const orderDate = order.attributes.date;

      // Check if the order date is within the specified date range
      if (orderDate >= startDate && orderDate <= endDate) {
        const processedObject = {};

        order.attributes.order_details.data.forEach((detail) => {
          const skuID =
            detail.attributes.scentID_fk.data.attributes.SKU_fk.data.id;

          if (!processedObject[skuID]) {
            processedObject[skuID] = {
              name: detail.attributes.scentID_fk.data.attributes.SKU_fk.data
                .attributes.name,
              details: [],
            };
          }

          processedObject[skuID].details.push({
            ml: detail.attributes.scentID_fk.data.attributes.milliLts,
            quantity: detail.attributes.quantity,
            price: detail.attributes.price,
            ethanol: {
              2: 7,
              16: 30,
              20: 50,
            },
          });
        });

        Object.keys(processedObject).forEach((skuID) => {
          processedObject[skuID].details.sort((a, b) => a.ml - b.ml);
        });

        processedOrders.push(processedObject);
      }
    });

    return processedOrders;
  };

  return (
    <>
      {isLoading ? (
        <p>Loading... Please Wait...</p>
      ) : (
        <>
          <div className="text-xl font-bold pb-5 align-middle">
            Invoicing for {format(parseISO(fmtStartDate), dateInvoiceFormat)} to{" "}
            {format(parseISO(fmtEndDate), dateInvoiceFormat)}
          </div>

          <>
            {/* Display overall totals at the top */}
            <table className="table-auto text-center border-collapse py-3">
              <tbody>
                <tr>
                  <td className="border p-3 font-medium">
                    Orders in the Invoice
                  </td>
                  <td className="border p-3">
                    {formatter.format(totalOrderCountInvoices)}
                  </td>
                </tr>

                <tr>
                  <td className="border p-3 font-medium">Total Quantities</td>
                  <td className="border p-3">
                    {formatter.format(totalQuantitiesAllInvoices)}
                  </td>
                </tr>

                <tr>
                  <td className="border p-3 font-medium">Total Ethanol Cost</td>
                  <td className="border p-3">
                    {formatter.format(totalEthanolCostAllInvoices)}
                  </td>
                </tr>

                <tr>
                  <td className="border p-3 font-medium">Total Scents Bill</td>
                  <td className="border p-3">
                    {formatter.format(totalScentsBillAllInvoices)}
                  </td>
                </tr>

                <tr>
                  <td className="border p-3 font-medium">
                    Overall Invoice Amount
                  </td>
                  <td className="border p-3">
                    {formatter.format(totalOverallAmountToInvoice)}
                  </td>
                </tr>
              </tbody>
            </table>
            <>
              {/* <div className="text-lg font-bold pb-4">
              Total Orders in Invoice: {totalOrderCountInvoices}
            </div>
            <div className="text-lg font-bold pb-4">
              Total Quantities: {totalQuantitiesAllInvoices}
            </div>
            <div className="text-lg font-bold pb-4">
              Total Ethanol Cost:{" "}
              {formatter.format(totalEthanolCostAllInvoices)}
            </div>
            <div className="text-lg font-bold pb-4">
              Total Scents Bill: {formatter.format(totalScentsBillAllInvoices)}
            </div>
            <div className="text-xl font-bold pb-4">
              Overall Amount to be Invoiced:{" "}
              {formatter.format(totalOverallAmountToInvoice)}
            </div> */}
            </>
          </>

          <div className="flex py-5">
            {/* Add a button to toggle the visibility of invoice details */}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowInvoicesPressed(!showInvoicesPressed)}
            >
              {showInvoicesPressed ? "Hide Invoices" : "Show Invoices"}
            </button>
          </div>

          {showInvoicesPressed && (
            <>
              {totalOrderCountInvoices > 0 ? (
                <div className="text-xl font-bold pb-4">Invoice History</div>
              ) : (
                <p>No invoices to display</p>
              )}

              {pastOrders.attributes.orders.data
                .filter((order) => {
                  const orderDate = order.attributes.date;
                  // console.log("Order Date:", orderDate);
                  // console.log("Start Date:", fmtStartDate);
                  // console.log("End Date:", fmtEndDate);

                  return orderDate >= fmtStartDate && orderDate <= fmtEndDate;
                })
                .map((order, index) => {
                  let subtotal = 0;
                  let totalQuantities = 0;
                  let totalSubtotals = 0;
                  let totalEthanolCost = 0;
                  return (
                    <div key={order.id}>
                      <div>
                        Invoice #{order.id} generated on {order.attributes.date}
                      </div>
                      <table className="table-auto text-center border-collapse py-3">
                        <thead>
                          <tr>
                            <th className="border p-3">SKU</th>
                            <th className="border p-3">Name</th>
                            <th className="border p-3">ML</th>
                            <th className="border p-3">Quantity</th>
                            <th className="border p-3">Price</th>
                            <th className="border p-3">Sub-total</th>
                            <th className="border p-3">Ethanol</th>
                          </tr>
                        </thead>

                        <tbody>
                          {Object.keys(processedData[index]).map((skuID) =>
                            processedData[index][skuID].details.map(
                              (detail, i) => {
                                subtotal = calculateSubtotal(detail);
                                totalQuantities += detail.quantity || 0;
                                totalSubtotals += subtotal;
                                totalEthanolCost +=
                                  (detail.ethanol[detail.ml] || 0) *
                                  detail.quantity;

                                return (
                                  <tr key={`${skuID}-${i}`}>
                                    <td className="border p-3">{skuID}</td>
                                    <td className="border p-3">
                                      {processedData[index][skuID].name}
                                    </td>
                                    <td className="border p-3">{detail.ml}</td>
                                    <td className="border p-3">
                                      {detail.quantity}
                                    </td>
                                    <td className="border p-3">
                                      {formatter.format(detail.price)}
                                    </td>
                                    <td className="border p-3">
                                      {formatter.format(
                                        calculateSubtotal(detail)
                                      )}
                                    </td>
                                    <td className="border p-3">
                                      {detail.ethanol[detail.ml]}
                                    </td>
                                  </tr>
                                );
                              }
                            )
                          )}
                        </tbody>
                      </table>
                      <div className="flex flex-col">
                        <div className="flex flex-col">
                          <div>Total Quantities: {totalQuantities}</div>
                          <div>
                            Total Ethanol Cost:{" "}
                            {formatter.format(totalEthanolCost)}
                          </div>
                          <div>
                            Scents Bill: {formatter.format(totalSubtotals)}
                          </div>
                          <div className="font-semibold">
                            Final Bill :{" "}
                            {formatter.format(
                              totalSubtotals + totalEthanolCost
                            )}
                          </div>
                        </div>
                      </div>
                      {
                        "----------------------------------------------------------"
                      }
                    </div>
                  );
                })}
            </>
          )}
        </>
      )}
    </>
  );
};

export default TenDayItem;
