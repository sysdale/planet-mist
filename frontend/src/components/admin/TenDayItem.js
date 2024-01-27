import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import qs from "qs";
import { addDays, startOfMonth, isAfter, format, parseISO } from "date-fns";
import { AppContext } from "../../store/AppContext";

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

const prices = {
  flyer: {
    small: 11,
    medium: 15,
    large: 18,
  },
  bubble: {
    small: 16,
    medium: 24,
    large: 32,
  },
};

const formatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

const TenDayItem = () => {
  const { state } = useLocation();

  const buyerID = state?.buyerID || null;
  const dateFilter = state?.dateFilter || null;

  const dateFormat = "yyyy-MM-dd";
  const dateInvoiceFormat = "dd MMMM yyyy";

  const { buyerName } = useContext(AppContext);

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
  const [totalFlyerCost, setTotalFlyerCost] = useState(0);
  const [totalBubbleWrapCost, setTotalBubbleWrapCost] = useState(0);

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

  const getPrice = (type, totalQuantities) => {
    if (!prices[type]) {
      throw new Error(`Invalid type: ${type}`);
    }
    const priceObject = prices[type];
    if (totalQuantities >= 1 && totalQuantities <= 2) {
      return { price: priceObject["small"], size: "small" };
    } else if (totalQuantities >= 3 && totalQuantities <= 4) {
      return { price: priceObject["medium"], size: "medium" };
    } else if (totalQuantities > 4) {
      return { price: priceObject["large"], size: "large" };
    }
    return 0; // fallback price if quantity is out of range
  };
  const handleCost = (totalQuantities, type) => {
    const { price, size } = getPrice(type, totalQuantities);
    return (
      <span>
        ({size}) - {price}
      </span>
    );
  };

  const findingCosts = (processedData) => {
    processedData.forEach((processedObject, orderIndex) => {
      let overallFlyer = 0;
      let overallBubble = 0;
      // Iterate through each order in processedData
      processedData.forEach((processedObject, orderIndex) => {
        // Initialize counter for the current order
        let totalQuantitiesInOrder = 0;

        Object.keys(processedObject).forEach((skuID) => {
          processedObject[skuID].details.forEach((detail) => {
            // Increment the counter with the quantity for each item in the current order
            totalQuantitiesInOrder += detail.quantity || 0;
          });
        });

        // Log or use totalQuantitiesInOrder as needed
        console.log(
          `Order ${orderIndex + 1} has ${totalQuantitiesInOrder} quantities.`
        );

        const { price: fprice } = getPrice("flyer", totalQuantitiesInOrder);
        overallFlyer += fprice;
        const { price: bprice } = getPrice("bubble", totalQuantitiesInOrder);
        overallBubble += bprice;
      });

      setTotalFlyerCost(overallFlyer);
      setTotalBubbleWrapCost(overallBubble);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BUYERS}/${id}?${query}`
        );
        response.data.data.attributes.orders.data.sort((a, b) => b.id - a.id);
        setPastOrders(response.data.data);
        const transformed = processOrderData(
          response.data.data,
          fmtStartDate,
          fmtEndDate
        );
        setProcessedData(transformed);
        findingCosts(transformed);
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLoading ? (
        <p>Loading... Please Wait...</p>
      ) : (
        <>
          <div className="text-xl font-bold pb-5 align-middle">
            Invoicing for {format(parseISO(fmtStartDate), dateInvoiceFormat)} to{" "}
            {format(parseISO(fmtEndDate), dateInvoiceFormat)}
          </div>

          <div>
            Buyer Name: <span className="font-bold">{buyerName}</span>
          </div>
          <div className="text-xl font-bold pb-5 align-middle">{}</div>

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
                  <td className="border p-3 font-medium ">Total Quantities</td>
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
                  <td className="border p-3 font-medium">Overall Flyer Cost</td>
                  <td className="border p-3">
                    {formatter.format(totalFlyerCost)}
                  </td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">
                    Overall Bubble Wrap Cost
                  </td>
                  <td className="border p-3">
                    {formatter.format(totalBubbleWrapCost)}
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
          </>

          <div className="flex py-5">
            {/* Add a button to toggle the visibility of invoice details */}
            <button
              className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
                  let bwrapCost = 0;
                  let flyerCost = 0;
                  return (
                    <div key={order.id}>
                      <div>
                        Invoice #{" "}
                        <span className="text-blue-700 font-medium">
                          {order.id}
                        </span>{" "}
                        generated on{" "}
                        <span className="font-medium">
                          {format(
                            parseISO(order.attributes.date),
                            dateInvoiceFormat
                          )}
                        </span>
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
                        <div
                          className="py-2"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div>Total Quantities: {totalQuantities}</div>
                          <div>
                            Total Ethanol Cost:{" "}
                            {formatter.format(totalEthanolCost)}
                          </div>
                          <div>
                            Flyer Cost: {handleCost(totalQuantities, "flyer")}
                          </div>
                          <div>
                            B.Wrap Cost: {handleCost(totalQuantities, "bubble")}
                          </div>
                          <div>
                            Scents Bill: {formatter.format(totalSubtotals)}
                          </div>
                          <div className="font-semibold pt-2">
                            Final Bill :{" "}
                            {formatter.format(
                              totalSubtotals + totalEthanolCost
                            )}
                          </div>
                        </div>
                      </div>
                      {
                        "----------------------------------------------------------------------------"
                      }
                    </div>
                  );
                })}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TenDayItem;
