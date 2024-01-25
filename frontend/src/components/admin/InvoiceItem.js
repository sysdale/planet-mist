import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import qs from "qs";
import { format, parseISO } from "date-fns";

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

const InvoiceItem = () => {
  const { state } = useLocation();
  const buyerID = state?.buyerID || null;
  const dateFilter = state?.dateFilter || null;
  const { id } = useParams() || { id: buyerID };
  const dateFormat = "dd MMMM yyyy";

  const [pastOrders, setPastOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processedData, setProcessedData] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BUYERS}/${id}?${query}`
        );
        response.data.data.attributes.orders.data.sort((a, b) => b.id - a.id);
        setPastOrders(response.data.data);
        const transformed = processOrderData(response.data.data);
        setProcessedData(transformed);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processOrderData = (data) => {
    const processedOrders = [];
    console.log(data);

    data.attributes.orders.data.forEach((order) => {
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
    });

    return processedOrders;
  };

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

  return (
    <>
      {isLoading ? (
        <p>Loading... Please Wait...</p>
      ) : (
        <>
          <div className="text-3xl font-bold pb-5 align-middle">
            Welcome, {pastOrders.attributes.buyerName}
          </div>

          {pastOrders.attributes.orders.data.length ? (
            <div className="text-xl font-bold pb-4">Invoice History</div>
          ) : (
            <p>No invoices to display</p>
          )}

          {pastOrders.attributes.orders.data
            .filter((item) =>
              dateFilter ? item.attributes.date === dateFilter : true
            )
            .map((order, index) => {
              let subtotal = 0;
              let totalQuantities = 0;
              let totalSubtotals = 0;
              let totalEthanolCost = 0;
              return (
                <div key={order.id}>
                  <div>
                    Invoice #{" "}
                    <span className="text-blue-700 font-medium">
                      {order.id}
                    </span>{" "}
                    generated on{" "}
                    <span className="font-medium">
                      {format(parseISO(order.attributes.date), dateFormat)}
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
                        processedData[index][skuID].details.map((detail, i) => {
                          subtotal = calculateSubtotal(detail);
                          totalQuantities += detail.quantity || 0;
                          totalSubtotals += subtotal;
                          totalEthanolCost +=
                            (detail.ethanol[detail.ml] || 0) * detail.quantity;

                          return (
                            <tr key={`${skuID}-${i}`}>
                              <td className="border p-3">{skuID}</td>
                              <td className="border p-3">
                                {processedData[index][skuID].name}
                              </td>
                              <td className="border p-3">{detail.ml}</td>
                              <td className="border p-3">{detail.quantity}</td>
                              <td className="border p-3">
                                {formatter.format(detail.price)}
                              </td>
                              <td className="border p-3">
                                {formatter.format(calculateSubtotal(detail))}
                              </td>
                              <td className="border p-3">
                                {detail.ethanol[detail.ml]}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                  <div className="flex flex-col">
                    <div className="flex flex-col">
                      <div>Total Quantities: {totalQuantities}</div>
                      <div>
                        Total Ethanol Cost: {formatter.format(totalEthanolCost)}
                      </div>
                      <div>
                        Flyer Cost: {handleCost(totalQuantities, "flyer")}
                      </div>
                      <div>
                        B.Wrap Cost: {handleCost(totalQuantities, "bubble")}
                      </div>
                      <div>Scents Bill: {formatter.format(totalSubtotals)}</div>
                      <div className="font-semibold">
                        Final Bill :{" "}
                        {formatter.format(totalSubtotals + totalEthanolCost)}
                      </div>
                    </div>
                  </div>
                  {
                    "---------------------------------------------------------------------------------------"
                  }
                </div>
              );
            })}
        </>
      )}
    </>
  );
};

export default InvoiceItem;
