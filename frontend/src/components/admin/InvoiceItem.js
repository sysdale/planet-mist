import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import qs from "qs";
import { format } from "date-fns";

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

const InvoiceItem = () => {
  const { state } = useLocation();
  const buyerID = state?.buyerID || null;
  const dateFilter = state?.dateFilter || null;
  const invoicedStatus = state?.invoicedStatus || null;
  const { id } = useParams() || { id: buyerID };

  const [totalQuantities, setTotalQuantities] = useState(0);
  const [totalSubtotals, setTotalSubtotals] = useState(0);
  const [totalEthanolCost, setTotalEthanolCost] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  const [pastOrders, setPastOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BUYERS}/${id}?${query}`
        );
        setPastOrders(response.data.data);
        const transformed = processOrderData(response.data.data);
        setProcessedData(transformed);

        calculateTotals(response.data.data);
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
          price: detail.attributes.scentID_fk.data.attributes.price,
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

  const calculateTotals = (ordersList) => {
    let currtotalQuantities = 0;
    let currtotalSubtotals = 0;
    let totalEthanolCost = 0;

    ordersList.attributes.orders.data
      .filter((order) =>
        dateFilter ? order.attributes.date === dateFilter : true
      )
      .forEach((order, index) => {
        processedData[index] &&
          Object.keys(processedData[index]).forEach((skuID) =>
            processedData[index][skuID].details.forEach((detail) => {
              currtotalQuantities += detail.quantity || 0;
              currtotalSubtotals += calculateSubtotal(detail);
              totalEthanolCost +=
                (detail.ethanol[detail.ml] || 0) * detail.quantity;
            })
          );
      });

    setTotalQuantities(currtotalQuantities);
    setTotalSubtotals(currtotalSubtotals);
    setTotalEthanolCost(totalEthanolCost);
    setFinalTotal(currtotalSubtotals + totalEthanolCost);
  };

  const calculateSubtotal = (detail) => {
    const quantity = detail.quantity || 0;
    const price = detail.price || 0;
    const ethanol = {
      2: 7,
      16: 30,
      20: 50,
    };

    return quantity * price + (ethanol[detail.ml] || 0) * quantity;
  };

  return (
    <>
      {isLoading ? (
        <p>Loading... Please Wait...</p>
      ) : (
        <>
          <div className="text-xl pb-5">
            Welcome, {pastOrders.attributes.buyerName}
          </div>

          <div className="text-xl font-bold pb-4">Order History</div>

          {pastOrders.attributes.orders.data
            .filter((order) =>
              dateFilter ? order.attributes.date === dateFilter : true
            )
            .map((order, index) => {
              return (
                <div key={order.id}>
                  <div>
                    Invoice #{order.id} generated on {order.attributes.date}
                  </div>
                  <table className="table-auto text-center border-separate py-3">
                    <thead>
                      <tr>
                        <th>SKU</th>
                        <th>Name</th>
                        <th>ML</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Ethanol</th>
                        <th>Sub-total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(processedData[index]).map((skuID) =>
                        processedData[index][skuID].details.map((detail, i) => {
                          return (
                            <tr key={`${skuID}-${i}`}>
                              <td>{skuID}</td>
                              <td>{processedData[index][skuID].name}</td>
                              <td>{detail.ml}</td>
                              <td>{detail.quantity}</td>
                              <td>{formatter.format(detail.price)}</td>
                              <td>{detail.ethanol[detail.ml]}</td>
                              <td>
                                {formatter.format(calculateSubtotal(detail))}
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
                        Total Subtotals: {formatter.format(totalSubtotals)}
                      </div>
                      <div>
                        Total Ethanol Cost: {formatter.format(totalEthanolCost)}
                      </div>
                      <div>Final Bill: {formatter.format(finalTotal)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
        </>
      )}
    </>
  );
};

export default InvoiceItem;
